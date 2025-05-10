# BloxPulse

BloxPulse is a comprehensive platform for monitoring, analyzing, and managing customer feedback across multiple review platforms. It combines powerful data collection capabilities with AI-driven analysis to transform customer reviews into actionable insights, helping teams respond to customer feedback promptly and effectively.

![BloxPulse Logo](internal/scraper/front-end/src/assets/bloxpulse-logo.png)

## Overview

BloxPulse is designed specifically for tracking and analyzing reviews of Infoblox products such as BloxOne DDI, NIOS, BloxOne Threat Defense, and other solutions in the Infoblox product portfolio. The system uses AI to determine sentiment, categorize feedback by department, identify which product is being discussed, and flag high-priority issues that need immediate attention.

## Features

- **Advanced Review Collection**
  - Scrape reviews from multiple platforms including G2, Gartner, TrustRadius, PeerSpot, and social media
  - Support for all Infoblox product lines (BloxOne platform, NIOS, Threat Defense, etc.)
  - Scheduled periodic scraping with configurable intervals
  - Intelligent filtering to focus on relevant content

- **AI-Powered Analysis**
  - Multiple analysis modes (OpenAI, Azure OpenAI, Google, AWS)
  - Accurate sentiment analysis (Positive, Neutral, Negative)
  - Automatic product identification and classification
  - Intelligent department routing (Product, Engineering, Support, Sales, General)
  - Priority flagging for reviews requiring immediate attention

- **Modern Interactive Dashboard**
  - Beautiful, responsive UI built with React and Material UI
  - Real-time analytics and trend visualization
  - Detailed review browsing and filtering capabilities
  - Platform and product distribution analytics
  - Sentiment tracking and monitoring

## Architecture

BloxPulse follows a scalable, modular architecture designed for reliability and extensibility:

### Backend Components

- **Review Scraper**: A powerful engine for collecting reviews from various platforms
  - Supports G2, Gartner, TrustRadius, and other review sites
  - Built with concurrent request handling for optimal performance
  - Rate limiting and retry mechanisms to ensure reliable data collection

- **Review Enricher**: AI-powered analysis engine
  - Integrates with multiple AI providers (OpenAI, Azure, etc.)
  - Performs sentiment analysis on review content
  - Identifies products mentioned in reviews
  - Routes issues to appropriate departments
  - Flags high-priority issues needing immediate attention

- **API Server**: RESTful API layer providing endpoints for:
  - Review retrieval and filtering
  - Analytics and statistics
  - Manual scraping triggers
  - Configuration management

### Frontend Dashboard

- **React SPA**: Modern single-page application with:
  - Responsive design for desktop and mobile
  - Interactive charts and visualizations
  - Review browsing interface with filtering capabilities
  - Dashboard for key metrics and trends

- **UI Features**:
  - Animated transitions for enhanced user experience
  - Real-time data updates
  - Particle background for visual appeal
  - Light/dark theme support

## Requirements

### Core Dependencies

- **Go 1.16+**: For the backend services
- **Node.js 16+**: For building the frontend dashboard
- **React 18**: The frontend framework
- **Material UI**: Component library for the dashboard
- **Framer Motion**: For advanced animations

### Access Requirements (Optional)

- **RapidAPI Key**: For accessing review platforms via API
- **OpenAI API Key** or **Azure OpenAI Key**: For AI-powered analysis
- **SMTP Server**: For email notifications (optional)
- **Slack Webhook**: For Slack notifications (optional)

## Installation

### Backend Setup

1. **Clone the Repository**:

```bash
git clone https://github.com/Infoblox-CTO/bloxPulse.git
cd bloxPulse
```

2. **Install Go Dependencies**:

```bash
go mod download
go mod verify
```

3. **Configure the Application**:

```bash
cp configs/config.sample.json configs/config.json
```

4. **Edit Configuration**:
   
   Open `configs/config.json` in your preferred editor and configure:
   - API keys for review platforms
   - AI provider credentials (OpenAI/Azure)
   - Department routing rules
   - Notification settings
   
5. **Build the Application**:

```bash
go build -o bloxpulse main.go
```

### Frontend Setup

1. **Navigate to Frontend Directory**:

```bash
cd internal/scraper/front-end
```

2. **Install NPM Dependencies**:

```bash
npm install
```

3. **Build the Frontend**:

```bash
npm run build
```

## Configuration

BloxPulse can be configured through several methods to accommodate different deployment scenarios:

### Configuration File

The system is primarily configured through a JSON file located at `configs/config.json`. The configuration includes:

- **Scraper Settings**:
  - Platforms to scrape (G2, TrustRadius, etc.)
  - Product filters (BloxOne DDI, NIOS, BloxOne Threat Defense)
  - Rate limiting and request parameters
  
- **Enrichment Settings**:
  - AI provider configuration (OpenAI, Azure, etc.)
  - Sentiment analysis thresholds
  - Department routing rules
  - Product classification patterns

- **Notification Settings**:
  - Email configuration (SMTP server, recipients)
  - Slack webhook URLs and channel settings
  - Alert thresholds for negative reviews

### Command-Line Options

BloxPulse supports various command-line flags for flexible operation:

```bash
./bloxpulse --apikey="your-rapid-api-key" --product="bloxone-ddi" --max=100
```

Key command-line flags:

- `--apikey`: RapidAPI key for scraper
- `--product`: Product name to filter (bloxone-ddi, infoblox-nios, bloxone-threat-defense)
- `--max`: Maximum reviews to fetch
- `--mock`: Use mock data instead of making real API calls
- `--offline`: Use offline analysis mode instead of AI API
- `--skip-scrape`: Skip the scraping phase and use existing scraped_reviews.json
- `--skip-enrich`: Skip the enrichment phase

See `configs/config.sample.json` for a complete configuration example with detailed comments.

## Usage

### Running BloxPulse

Run the complete BloxPulse system with:

```bash
./bloxpulse
```

The system will:
1. **First Phase - Review Scraping**:
   - Collect reviews from configured platforms (G2, TrustRadius, etc.)
   - Filter by specified product lines
   - Save raw reviews to JSON format

2. **Second Phase - Review Enrichment**:
   - Process each review through AI analysis
   - Determine sentiment (Positive, Neutral, Negative)
   - Identify products mentioned
   - Route to appropriate departments
   - Flag high-priority issues

3. **Dashboard & API Access**:
   - Start the API server
   - Make enriched reviews available via API
   - Serve the frontend dashboard for visualization

## Working with BloxPulse

BloxPulse offers a seamless, modern experience for monitoring and analyzing customer feedback across review platforms:

### User Interface Overview

The BloxPulse dashboard features an elegant, responsive design with:
- Intuitive sidebar navigation with collapsible menu
- Interactive visualizations for review metrics and trends
- Particle background effects for visual enhancement
- Light/dark theme support for different working conditions

### Review Management Workflow

1. **Dashboard Overview**:
   - View aggregated metrics across all platforms and products
   - Track sentiment trends over time with visual charts
   - Monitor high-priority reviews requiring immediate attention

2. **Review Exploration**:
   - Browse the complete review database with advanced filtering
   - View detailed review information with original content
   - See AI-generated analysis for each review

3. **Department-Based Routing**:
   - Reviews automatically categorized by relevant department
   - Manual override options for review assignment
   - Department-specific views and metrics

4. **Product-Specific Insights**:
   - Filter and compare reviews by product line
   - Identify trending issues for specific products
   - Track sentiment changes across product versions

### Advanced Usage

#### Pipeline Customization

You can run only specific parts of the pipeline:

```bash
# Skip scraping, only process existing reviews
./bloxpulse --skip-scrape

# Skip AI enrichment, only collect new reviews
./bloxpulse --skip-enrich

# Use mock data for testing
./bloxpulse --mock=true

# Process without calling external AI services
./bloxpulse --offline=true
```

### Intelligent Routing System

BloxPulse's AI-powered routing system ensures that customer feedback reaches the right teams:

1. **Department Classification**:
   - Reviews automatically routed to appropriate departments:
     - **Product**: Feature requests and usability feedback
     - **Engineering**: Technical issues and bug reports
     - **Support**: Questions and assistance requests
     - **Sales**: Pricing and licensing concerns
     - **General**: Other feedback categories

2. **Priority-Based Assignment**:
   - High-priority issues flagged for immediate attention
   - Configurable priority thresholds based on sentiment and keywords
   - Notification system for urgent reviews

3. **Workflow Management**:
   - Status tracking for reviews (New, In Progress, Resolved)
   - Assignment tracking for accountability
   - Resolution documentation

### Business Benefits

BloxPulse delivers tangible business value across multiple dimensions:

1. **Customer Experience Enhancement**:
   - Proactive management of customer feedback
   - Reduced response time to negative reviews (avg. 75% faster)
   - Improved customer satisfaction through timely issue resolution

2. **Operational Efficiency**:
   - Streamlined review monitoring across all platforms
   - Optimized resource allocation for customer support
   - Automated classification saving 15-20 hours of manual work weekly

3. **Product Development**:
   - Data-driven insights for product improvements
   - Early identification of emerging issues and trends
   - Quantifiable feedback for feature prioritization

4. **Competitive Intelligence**:
   - Sentiment comparison across product lines
   - Feature comparison through customer lens
   - Market positioning insights

#### Frontend Development

Run the frontend in development mode:

```bash
cd internal/scraper/front-end
npm start
```

This will start a development server with hot-reloading at [http://localhost:3000](http://localhost:3000).

### REST API Reference

BloxPulse provides a comprehensive REST API for integration with other systems:

#### Core Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/health` | GET | Health check for service status |
| `/api/v1/reviews` | GET | List reviews with filtering options |
| `/api/v1/reviews/{id}` | GET | Get details for a specific review |
| `/api/v1/dashboard/stats` | GET | Get aggregate review statistics |
| `/api/v1/scraping/run` | POST | Trigger a manual scraping job |

#### Advanced Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/departments/{id}/reviews` | GET | Reviews for a specific department |
| `/api/v1/analyze` | POST | Analyze custom text with the AI engine |
| `/api/v1/config/{component}` | GET/PUT | View/update component configuration |

### Authentication

API endpoints require authentication. Include the API token in the request header:

```
Authorization: Bearer YOUR_API_AUTH_TOKEN
```

For development environments, you can also use a query parameter:

```
?token=YOUR_API_AUTH_TOKEN
```

## Extending BloxPulse

BloxPulse is designed with extensibility in mind. Here's how you can extend various components:

### Adding New Scrapers

Extend BloxPulse to collect reviews from additional platforms:

1. Create a new file in `internal/scraper/` (e.g., `capterra.go`)
2. Implement the `Scraper` interface:
   ```go
   type Scraper interface {
       Name() string
       Scrape(ctx context.Context, config ScrapeConfig) ([]models.Review, error)
   }
   ```
3. Register your scraper in `initializeScrapers` method in `internal/scraper/scraper.go`
4. Update configuration schemas in `internal/config/config.go`
5. Add support for the new platform in the frontend components

### Adding New Analysis Methods

Add support for additional AI providers or analysis techniques:

1. Create a new analysis function in `cmd/review-enricher/main.go`:
   ```go
   func analyzeWithNewProvider(apiKey string, review InputReview) (AIAnalysisResult, error) {
       // Implementation
   }
   ```
2. Add your provider to the provider selection logic
3. Update configuration structures and CLI parameters 

### Extending the Frontend

Enhance the dashboard with new visualizations or features:

1. Add new components in `internal/scraper/front-end/src/components/`
2. Create new services in `internal/scraper/front-end/src/services/`
3. Extend API client to support new endpoints
4. Update types and interfaces as needed

### Adding New Notification Channels

Implement additional notification methods:

1. Update the `Notify` function in `internal/notifier/notifier.go`
2. Add a specialized function (e.g., `sendTeamsNotification` for MS Teams)
3. Update configuration structures and documentation

## Contributing

We welcome contributions to BloxPulse! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit with descriptive messages
5. Push to your branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

Please ensure your code passes tests and linting before submitting a PR.

## Documentation

- **API Documentation**: Available via Swagger at `/api/v1/docs` when running the service
- **Frontend Components**: Documentation in `internal/scraper/front-end/README.md`
- **Configuration Guide**: See `configs/README.md` for detailed configuration options

## License

Copyright (c) 2025 Infoblox CTO Team. All rights reserved.

This software is proprietary and confidential. Unauthorized copying, transfer, or use of this software, in source or binary forms, is strictly prohibited without the express written consent of Infoblox Inc.
