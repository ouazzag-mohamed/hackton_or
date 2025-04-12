# Academic Guidance in Morocco Research Tool

This project consists of two main components:

1. **JSON Research Generator**: Uses the Google Gemini API to conduct comprehensive research on academic guidance and counseling in Morocco and generates detailed JSON reports in multiple languages.

2. **Interactive Guidance Agent**: A conversational agent that processes the generated JSON reports to provide expert guidance on Moroccan education in multiple languages.

## Features

### JSON Research Generator
- Uses Google Gemini API for intelligent analysis and content generation
- Searches the web for relevant information on academic guidance in Morocco
- Scrapes and processes content from multiple sources
- Generates comprehensive JSON reports with proper structure in multiple languages
- Covers various aspects of academic guidance across different educational levels

### Guidance Agent
- Extracts and processes knowledge from the generated JSON reports
- Provides expert guidance on Moroccan education systems and academic counseling
- Supports multiple languages (English, French, Arabic, Spanish)
- Automatically detects the language of user queries
- Uses Gemini API to deliver accurate, contextual responses
- **Memory system that remembers previous conversations for continuity**

## Prerequisites

- Node.js (version 14 or higher)
- A Google Gemini API key (Get one from [Google AI Studio](https://ai.google.dev/))

## Installation

1. Clone or download this repository
2. Install dependencies:

```bash
npm install
```

3. Configure your API key:
   - Open the `.env` file
   - Replace `your_api_key_here` with your actual Google Gemini API key

## Usage

### Step 1: Generate the Research JSON Files

Run the JSON generator:

```bash
node index.js
```

This will:
1. Search the web for information on academic guidance in Morocco
2. Use Google Gemini to analyze the information and generate content
3. Create JSON reports in multiple languages:
   - `academic_guidance_morocco_report.json` (English)
   - `academic_guidance_morocco_report_fr.json` (French)
   - `academic_guidance_morocco_report_ar.json` (Arabic)

### Step 2: Run the Guidance Agent

After generating the JSON files, run the interactive guidance agent:

```bash
node guidance_agent.js
```

This will:
1. Load and process the JSON content as its knowledge base
2. Load any previous conversation history (if available)
3. Start an interactive console session where you can ask questions
4. Provide expert guidance based on the research in the language of your query
5. Save the conversation history for future continuity

### Memory System Commands

The guidance agent includes a conversation memory system with these commands:
- `memory status` - View information about stored conversations
- `clear memory` - Delete all stored conversation history 

## Research Topics Covered

The research covers the following topics:
- Academic guidance system in Moroccan primary education
- School counseling methods in Moroccan middle schools
- Educational guidance services in Moroccan high schools
- Career counseling in Moroccan universities
- Role of counselors in Moroccan education system
- Challenges in academic guidance in Morocco
- Evolution of academic counseling in Morocco
- Best practices in educational guidance in Morocco compared to international standards
- Top colleges and universities in Morocco with admission requirements
- Best schools in Morocco (primary and secondary) with registration procedures

## Technical Details

- Uses Gemini 1.5 Flash model for JSON content generation
- Uses Gemini 1.5 Pro model for the guidance agent
- Implements web scraping with Axios and Cheerio
- Handles environmental variables securely with dotenv
- Stores structured data in JSON format for efficient processing
- Supports multilingual content (English, French, Arabic)
- Persists conversation history in `conversation_history.json`

## Note

The web search functionality in this application is a simple implementation using web scraping. For production use, it's recommended to use an official search API like Google Custom Search JSON API.

## License

ISC"# ai_agent" 
