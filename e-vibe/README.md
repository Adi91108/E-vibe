# E-VIBE Game - Email Data Collection Setup

## Overview
The game now automatically sends player data to **allaboutdiksha@gmail.com** when they complete the purchase intention question.

## Email Service Setup (Required)

The game uses **Web3Forms** - a free email service that doesn't require a backend server.

### Step 1: Get Your Free API Key

1. Visit: https://web3forms.com/
2. Click "Get Started Free"
3. Enter your email: **allaboutdiksha@gmail.com**
4. Verify your email address
5. Copy your Access Key (it looks like: `8d0e3f4c-8f7c-4b3e-9a2f-1c6d8e9f4a2b`)

### Step 2: Update the Game Code

In the `evibe-game.jsx` file, find this line (around line 40):

```javascript
access_key: '8d0e3f4c-8f7c-4b3e-9a2f-1c6d8e9f4a2b',
```

Replace the placeholder key with your actual Web3Forms access key.

### Step 3: Deploy and Test

1. Deploy the game to your web server
2. Play through the game completely
3. Answer the purchase intention question
4. Check your email inbox for the data

## Data Format Received

Each submission will include:

### Email Body:
- Player Score
- Purchase Intention (Yes/Maybe/No)
- E-VIBE Choices (x/5)
- Total Cost Spent
- Total CO₂ Emissions
- Badges Earned
- Completion Timestamp
- Round-by-round details

### Also Includes:
- Complete JSON data in the email
- All player choices with timestamps
- Detailed breakdown per round

## Alternative: CSV Download

Players can also download their data as a CSV file (Excel-compatible) using the "Download CSV (Excel)" button. This provides:

- Round-by-round data in spreadsheet format
- Summary statistics
- Easy to import into Excel, Google Sheets, or SPSS for analysis

## Privacy Note

Inform players that their data will be:
- Sent to the researcher for academic purposes
- Used for sustainability research
- Kept confidential per research ethics

## Troubleshooting

### Emails Not Arriving?
1. Check spam/junk folder
2. Verify the access key is correct
3. Ensure email is verified in Web3Forms dashboard
4. Check Web3Forms dashboard for submission logs

### Need a Different Service?
Alternatives to Web3Forms:
- **EmailJS** (emailjs.com) - Free tier: 200 emails/month
- **FormSubmit** (formsubmit.co) - Completely free, no registration
- **Getform** (getform.io) - Free tier: 50 submissions/month

## Data Analysis Tips

### Import CSV to Excel:
1. Open Excel
2. File → Open → Select the CSV file
3. Data will auto-format into columns

### Aggregate Analysis:
- Use Excel pivot tables to analyze:
  - Purchase intention distribution
  - Average E-VIBE choice rate
  - Score correlations with choices
  - Cost vs environmental awareness

### Statistical Analysis:
The CSV format is compatible with:
- SPSS
- R (read.csv)
- Python pandas (pd.read_csv)
- Google Sheets

## Support

For technical issues with the game or email setup, refer to:
- Web3Forms Documentation: https://docs.web3forms.com/
- React Documentation: https://react.dev/

---

**Note:** The placeholder access key in the code won't work. You MUST replace it with your own key from Web3Forms for email functionality to work.
