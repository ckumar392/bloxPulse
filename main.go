package main

import (
	"flag"
	"log"
	"os"
	"time"
	"strings"

	enricher "github.com/Infoblox-CTO/bloxPulse/cmd/review-enricher"
	scraper "github.com/Infoblox-CTO/bloxPulse/cmd/review-scraper"
)
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
func main() {
	log.Println("Starting BloxPulse Review Pipeline...")

	// Command line flags
	apiKey := flag.String("apikey", "", "RapidAPI key for scraper")
	productName := flag.String("product", "", "Product name (bloxone-ddi, infoblox-nios, or bloxone-threat-defense)")
	maxReviews := flag.Int("max", 1000, "Maximum number of reviews to fetch")
	scrapedFile := flag.String("scraped", "scraped_reviews.json", "Path to save/read scraped reviews")
	enrichedFile := flag.String("enriched", "./internal/scraper/front-end/src/assets/enriched_reviews.json", "Path to save enriched reviews")
	useMock := flag.Bool("mock", false, "Use mock data instead of API calls")
	offlineMode := flag.Bool("offline", false, "Use offline analysis mode instead of AI API for enrichment")
	skipScrape := flag.Bool("skip-scrape", false, "Skip the scraping phase and use existing scraped_reviews.json")
	skipEnrich := flag.Bool("skip-enrich", false, "Skip the enrichment phase")
	flag.Parse()

	startTime := time.Now()

	// Phase 1: Scraping
	if !*skipScrape {
		log.Println("Phase 1: Starting Review Scraping...")
		scrapeOptions := scraper.ScrapeOptions{
			APIKey:      *apiKey,
			ProductName: *productName,
			MaxReviews:  *maxReviews,
			OutputFile:  *scrapedFile,
			UseMock:     *useMock,
		}

		if err := scraper.Run(scrapeOptions); err != nil {
			log.Fatalf("Scraping failed: %v", err)
		}

		log.Printf("Phase 1: Scraping complete. Reviews saved to %s", *scrapedFile)
	} else {
		log.Println("Skipping scrape phase as requested")

		// Verify the scraped file exists
		if _, err := os.Stat(*scrapedFile); os.IsNotExist(err) {
			log.Fatalf("Error: Scraped reviews file %s not found, but scraping was skipped", *scrapedFile)
		}
	}

	// Phase 2: Enrichment
	if !*skipEnrich {
		log.Println("Phase 2: Starting Review Enrichment...")

		enrichOptions := enricher.EnrichOptions{
			InputFile:   *scrapedFile,
			OutputFile:  *enrichedFile,
			OfflineMode: *offlineMode,
		}

		if err := enricher.Run(enrichOptions); err != nil {
			log.Fatalf("Enrichment failed: %v", err)
		}

		log.Printf("Phase 2: Enrichment complete. Enriched reviews saved to %s", *enrichedFile)
	} else {
		log.Println("Skipping enrichment phase as requested")
	}

	duration := time.Since(startTime)
	log.Printf("BloxPulse Review Pipeline completed successfully in %v", duration)
}
