package scraper

import (
	"encoding/json"
	// "flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

// Review represents a standardized review structure
type Review struct {
	ID            int      `json:"id"`
	ReviewID      int      `json:"reviewID"`
	Author        string   `json:"author"`
	Platform      string   `json:"platform"`
	Title         string   `json:"title"`
	PostContent   string   `json:"Postcontent"`
	ReplyContents string   `json:"replyContents"`
	Timestamp     string   `json:"timestamp"`
	Tags          []string `json:"tags"`
	Rating        int      `json:"rating"`
}

// G2Reviewer represents a reviewer on G2
type G2Reviewer struct {
	Name        string `json:"reviewer_name"`
	JobTitle    string `json:"reviewer_job_title"`
	Link        string `json:"reviewer_link"`
	CompanySize string `json:"reviewer_company_size"`
}

// G2ReviewQuestionAnswer represents a Q&A in a G2 review
type G2ReviewQuestionAnswer struct {
	Question string `json:"question"`
	Answer   string `json:"answer"`
}

// G2ReviewItem represents a single review in the G2 API response
type G2ReviewItem struct {
	ReviewID              int                      `json:"review_id"`
	ReviewTitle           string                   `json:"review_title"`
	ReviewContent         string                   `json:"review_content"`
	ReviewQuestionAnswers []G2ReviewQuestionAnswer `json:"review_question_answers"`
	ReviewRating          float64                  `json:"review_rating"`
	Reviewer              G2Reviewer               `json:"reviewer"`
	PublishDate           string                   `json:"publish_date"`
	ReviewLink            string                   `json:"review_link"`
}

// G2Response represents the expected response structure from G2 API
type G2Response struct {
	ProductID   int    `json:"product_id"`
	ProductName string `json:"product_name"`
	Categories  []struct {
		Name string `json:"name"`
	} `json:"categories"`
	InitialReviews []G2ReviewItem `json:"initial_reviews"`
	AllReviews     []G2ReviewItem `json:"all_reviews"`
}

// G2Client handles API requests to G2
type G2Client struct {
	APIKey string
	Host   string
	Client *http.Client
}

// NewG2Client creates a new G2 API client
func NewG2Client(apiKey string) *G2Client {
	return &G2Client{
		APIKey: apiKey,
		Host:   "g2-data-api.p.rapidapi.com",
		Client: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

// getG2ProductURL returns the G2 product URL for the given product
func getG2ProductURL(product string) string {
	return fmt.Sprintf("https://www.g2.com/products/%s/reviews", product)
}

// FetchReviews fetches reviews for a specific product from G2
func (c *G2Client) FetchReviews(product string, maxReviews int, retryCount int) ([]Review, error) {
	productURL := getG2ProductURL(product)
	encodedURL := url.QueryEscape(productURL)

	apiURL := fmt.Sprintf("https://%s/g2-products?product=%s&max_reviews=%d",
		c.Host, encodedURL, maxReviews)

	req, err := http.NewRequest("GET", apiURL, nil)
	if err != nil {
		return nil, fmt.Errorf("error creating request: %w", err)
	}

	req.Header.Add("x-rapidapi-key", c.APIKey)
	req.Header.Add("x-rapidapi-host", c.Host)

	res, err := c.Client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error making request: %w", err)
	}
	defer res.Body.Close()

	// Handle rate limiting with retries
	if res.StatusCode == http.StatusTooManyRequests && retryCount > 0 {
		retryAfter := 2 * time.Second // Default backoff
		if retryHeader := res.Header.Get("Retry-After"); retryHeader != "" {
			if retrySeconds, err := time.ParseDuration(retryHeader + "s"); err == nil {
				retryAfter = retrySeconds
			}
		}

		fmt.Printf("Rate limited. Waiting for %v before retry (%d attempts left)...\n",
			retryAfter, retryCount)
		time.Sleep(retryAfter)
		return c.FetchReviews(product, maxReviews, retryCount-1)
	}

	// Handle other error statuses
	if res.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(res.Body)
		return nil, fmt.Errorf("API returned status %d: %s", res.StatusCode, string(body))
	}

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, fmt.Errorf("error reading response body: %w", err)
	}

	// Debug: Save the raw JSON response to a file for inspection
	debugFile := fmt.Sprintf("%s_raw_response.json", product)
	if err := os.WriteFile(debugFile, body, 0644); err == nil {
		fmt.Printf("Saved raw response to %s for debugging\n", debugFile)
	}

	var g2Response G2Response
	if err := json.Unmarshal(body, &g2Response); err != nil {
		// Try logging the first 200 characters of the response for debugging
		preview := string(body)
		if len(preview) > 200 {
			preview = preview[:200] + "..."
		}
		fmt.Printf("Failed to parse response: %s\n", preview)
		return nil, fmt.Errorf("error parsing JSON response: %w", err)
	}

	// Combine initial_reviews and all_reviews (they often contain the same data)
	reviewItems := []G2ReviewItem{}

	// Add from initial_reviews if available
	if len(g2Response.InitialReviews) > 0 {
		reviewItems = append(reviewItems, g2Response.InitialReviews...)
	}

	// Add from all_reviews if available and different from initial_reviews
	if len(g2Response.AllReviews) > 0 && len(g2Response.InitialReviews) == 0 {
		reviewItems = append(reviewItems, g2Response.AllReviews...)
	}

	fmt.Printf("Product: %s, Found %d reviews\n",
		g2Response.ProductName, len(reviewItems))

	// Transform G2 response to our standardized Review format
	reviews := make([]Review, 0, len(reviewItems))

	for i, r := range reviewItems {
		// Get tags from categories
		tags := []string{product}
		for _, cat := range g2Response.Categories {
			if cat.Name != "" {
				tags = append(tags, cat.Name)
			}
		}

		review := Review{
			ID:            i + 1,
			ReviewID:      r.ReviewID,
			Author:        r.Reviewer.Name,
			Platform:      "G2",
			Title:         r.ReviewTitle,
			PostContent:   formatReviewContent(r.ReviewContent),
			ReplyContents: "", // Vendor replies are not separated in the API response
			Timestamp:     r.PublishDate,
			Tags:          tags,
			Rating:        int(r.ReviewRating),
		}
		reviews = append(reviews, review)
	}

	return reviews, nil
}

// createMockReviews creates mock reviews for demonstration purposes
func createMockReviews(product string) []Review {
	fmt.Printf("Creating mock reviews for %s since API access failed\n", product)

	reviews := []Review{
		{
			ID:            1,
			ReviewID:      101,
			Author:        "John Doe",
			Platform:      "G2",
			Title:         fmt.Sprintf("Great experience with %s", product),
			PostContent:   fmt.Sprint("What do you like best about BloxOne DDI?\nGreat DNS tool and all core network service are centrally managed\n\nWhat do you dislike about BloxOne DDI?\nThe license price is very high and the feeds are limited for threat Intel\n\nWhat problems is BloxOne DDI solving and how is that benefiting you?\nAssits us in protecting the DNS service"),
			
			ReplyContents: "Thank you for your review! We're glad you're enjoying our product.",
			Timestamp:     time.Now().Format(time.RFC3339),
			Tags:          []string{"Enterprise", "Easy to use", product},
			Rating:        5,
		},
		{
			ID:            2,
			ReviewID:      102,
			Author:        "Jane Smith",
			Platform:      "G2",
			Title:         fmt.Sprintf("Mixed feelings about %s", product),
			PostContent:   fmt.Sprintf("The %s product has good features but the UI needs improvement.", product),
			ReplyContents: "",
			Timestamp:     time.Now().AddDate(0, -1, 0).Format(time.RFC3339),
			Tags:          []string{"Mid-market", product},
			Rating:        3,
		},
	}

	return reviews
}

// SaveReviewsToJSON saves reviews to the specified JSON file
func SaveReviewsToJSON(reviews []Review, filePath string) error {
	// Create file
	file, err := os.Create(filePath)
	if err != nil {
		return fmt.Errorf("error creating file: %w", err)
	}
	defer file.Close()

	// Write reviews to file with pretty printing
	encoder := json.NewEncoder(file)
	encoder.SetIndent("", "  ")
	if err := encoder.Encode(reviews); err != nil {
		return fmt.Errorf("error encoding reviews to JSON: %w", err)
	}

	return nil
}

// ScrapeOptions contains configuration options for the scraper
type ScrapeOptions struct {
	APIKey      string
	ProductName string
	MaxReviews  int
	OutputFile  string
	UseMock     bool
}

// Run performs the scraping operation with the given options
func Run(options ScrapeOptions) error {
	// Load environment variables from .env file
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: Error loading .env file:", err)
	}

	apiKey := options.APIKey
	productName := options.ProductName
	maxReviews := options.MaxReviews
	outputFile := options.OutputFile
	useMock := options.UseMock

	// Validate API key if not using mock data
	if apiKey == "" && !useMock {
		// First check .env file, then regular environment variable
		apiKeyEnv := os.Getenv("RAPID_API_KEY")
		if apiKeyEnv == "" {
			log.Println("Warning: No API key provided. Either provide an API key, " +
				"set the RAPID_API_KEY in the .env file, or use mock data.")
			useMock = true
		} else {
			apiKey = apiKeyEnv
			log.Println("Using API key from environment variable")
		}
	}

	// Validate product names for infoblox reviews that we are interested in
	validProducts := map[string]bool{
		"bloxone-ddi":            true,
		"infoblox-nios":          true,
		"bloxone-threat-defense": true,
	}

	// If no product specified, scrape all valid products
	products := []string{}
	if productName == "" {
		fmt.Println("No product specified, processing all Infoblox products...")
		for product := range validProducts {
			products = append(products, product)
		}
	} else {
		if !validProducts[productName] {
			return fmt.Errorf("invalid product name. Choose from: bloxone-ddi, infoblox-nios, bloxone-threat-defense")
		}
		products = append(products, productName)
	}

	// Create G2 client
	client := NewG2Client(apiKey)

	// Combined reviews from all products
	var allReviews []Review

	// Scrape or mock each product
	for _, product := range products {
		if useMock {
			mockReviews := createMockReviews(product) // create mocks for different platforms
			allReviews = append(allReviews, mockReviews...)
			continue
		}

		fmt.Printf("Fetching reviews for %s (max: %d)...\n", product, maxReviews)
		maxRetries := 3
		reviews, err := client.FetchReviews(product, maxReviews, maxRetries)

		if err != nil {
			fmt.Printf("Error fetching reviews for %s: %v\n", product, err)
			fmt.Println("Falling back to mock data for this product...")
			mockReviews := createMockReviews(product)
			allReviews = append(allReviews, mockReviews...)
			continue
		}

		fmt.Printf("Successfully fetched %d reviews for %s\n", len(reviews), product)

		// Add product-specific tag to each review if not already present
		for i := range reviews {
			if !contains(reviews[i].Tags, product) {
				reviews[i].Tags = append(reviews[i].Tags, product)
			}
		}

		allReviews = append(allReviews, reviews...)

		// Respect rate limits by waiting between products
		if len(products) > 1 && product != products[len(products)-1] {
			fmt.Println("Waiting 2 seconds before fetching next product to respect rate limits...")
			time.Sleep(2 * time.Second)
		}
	}

	fmt.Printf("Total reviews collected: %d\n", len(allReviews))

	// Save all reviews to the output file
	err := SaveReviewsToJSON(allReviews, outputFile)
	if err != nil {
		return fmt.Errorf("error saving reviews: %v", err)
	}

	fmt.Printf("All reviews saved to %s\n", outputFile)
	return nil
}

// Helper function to check if a slice contains a string
func contains(slice []string, str string) bool {
	for _, item := range slice {
		if item == str {
			return true
		}
	}
	return false
}

func formatReviewContent(content string) string {
	// Remove questions and consolidate answers into a single paragraph

	// Common question patterns to identify and remove - add more as needed
	questionPatterns := []string{
		"What do you like best about",
		"What do you dislike about",
		"What problems is",
		"solving and how is that benefiting you",
	}

	// Work with each line
	lines := strings.Split(content, "\n")
	var resultLines []string

	for _, line := range lines {
		// Skip question lines
		skipLine := false
		for _, pattern := range questionPatterns {
			if strings.Contains(line, pattern) {
				skipLine = true
				break
			}
		}

		if !skipLine && strings.TrimSpace(line) != "" {
			resultLines = append(resultLines, strings.TrimSpace(line))
		}
	}

	// Join all content with spaces
	return strings.Join(resultLines, " ")
}
