export interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  slug: string;
  keywords: string[];
  affiliateLinks?: { name: string; url: string; description: string }[];
  longDescription?: string;
  howToSteps?: string[];
  features?: string[];
  faqs?: { question: string; answer: string }[];
}

export const categories = [
  "Image & Design Tools",
  "File Converters & Editors",
  "Generators & Makers",
  "Text & Code Tools",
  "Fun & Entertainment",
  "Finance & Calculators",
  "Health & Fitness",
  "Web & SEO Tools",
  "Productivity & Planning",
  "Time & Utilities",
];

export const tools: Tool[] = [
  // Homepage Entry - appears in search results for "tool260" variations
  {
    id: "0",
    name: "Tool 260 - Free Online Tools & Converters",
    category: "Productivity & Planning",
    description: "Tool260.com - Your all-in-one platform for 260+ free online tools including PDF converters, image editors, calculators, generators, and utilities. No sign-up required.",
    slug: "home",
    keywords: [
      "tool 260",
      "tool260",
      "tool 260 com",
      "tool260.com",
      "i love pdf",
      "small pdf",
      "ilovepdf",
      "smallpdf",
      "file converters",
      "pdf tools",
      "free online tools",
      "online converters",
      "free tools",
      "web tools",
      "online utilities",
      "free converters",
      "tool260 website",
      "260 tools",
      "all tools",
      "homepage"
    ]
  },

  // Productivity & Planning (1-40)
  { id: "1", name: "Advanced Todo List", category: "Productivity & Planning", description: "Create and manage your tasks with advanced features", slug: "advanced-todo-list", keywords: ["todo", "task", "productivity"] },
  { id: "2", name: "Pomodoro Timer", category: "Productivity & Planning", description: "Focus with the Pomodoro Technique", slug: "pomodoro-timer", keywords: ["pomodoro", "timer", "focus"] },
  { id: "3", name: "Countdown Timer", category: "Productivity & Planning", description: "Countdown to any event", slug: "countdown-timer", keywords: ["countdown", "timer", "event"] },
  { id: "4", name: "Stopwatch", category: "Productivity & Planning", description: "Precise stopwatch with lap times", slug: "stopwatch", keywords: ["stopwatch", "timer", "time"] },
  { id: "5", name: "World Clock", category: "Productivity & Planning", description: "View multiple timezones at once", slug: "world-clock", keywords: ["clock", "timezone", "world"] },
  { id: "6", name: "Meeting Scheduler", category: "Productivity & Planning", description: "Find the best meeting times across timezones", slug: "meeting-scheduler", keywords: ["meeting", "schedule", "calendar"] },
  { id: "7", name: "Habit Tracker", category: "Productivity & Planning", description: "Track and build good habits", slug: "habit-tracker", keywords: ["habit", "tracker", "routine"] },
  { id: "8", name: "Daily Journal", category: "Productivity & Planning", description: "Write and reflect on your day", slug: "daily-journal", keywords: ["journal", "diary", "writing"] },
  { id: "9", name: "Goal Tracker", category: "Productivity & Planning", description: "Set and track your goals", slug: "goal-tracker", keywords: ["goal", "tracker", "achievement"] },
  { id: "10", name: "Focus Music Player", category: "Productivity & Planning", description: "Ambient sounds for better focus", slug: "focus-music-player", keywords: ["music", "focus", "ambient"] },
  { id: "11", name: "Distraction Blocker", category: "Productivity & Planning", description: "Block distracting websites temporarily", slug: "distraction-blocker", keywords: ["blocker", "focus", "productivity"] },
  { id: "12", name: "Water Reminder", category: "Productivity & Planning", description: "Stay hydrated with smart reminders", slug: "water-reminder", keywords: ["water", "hydration", "health"] },
  { id: "13", name: "Posture Reminder", category: "Productivity & Planning", description: "Get reminded to check your posture", slug: "posture-reminder", keywords: ["posture", "health", "reminder"] },
  { id: "14", name: "Eye Break Reminder", category: "Productivity & Planning", description: "Protect your eyes with regular breaks", slug: "eye-break-reminder", keywords: ["eye", "break", "health"] },
  { id: "15", name: "Random Task Picker", category: "Productivity & Planning", description: "Pick a random task from your list", slug: "random-task-picker", keywords: ["random", "task", "picker"] },
  { id: "16", name: "Priority Matrix", category: "Productivity & Planning", description: "Eisenhower Matrix for task prioritization", slug: "priority-matrix", keywords: ["priority", "matrix", "eisenhower"] },
  { id: "17", name: "Kanban Board", category: "Productivity & Planning", description: "Visual task management board", slug: "kanban-board", keywords: ["kanban", "board", "tasks"] },
  { id: "18", name: "Mind Map Creator", category: "Productivity & Planning", description: "Create beautiful mind maps", slug: "mind-map-creator", keywords: ["mindmap", "brainstorm", "ideas"] },
  { id: "19", name: "Cornell Notes", category: "Productivity & Planning", description: "Cornell note-taking system", slug: "cornell-notes", keywords: ["notes", "cornell", "study"] },
  { id: "20", name: "Daily Planner", category: "Productivity & Planning", description: "Plan your day effectively", slug: "daily-planner", keywords: ["planner", "daily", "schedule"] },
  { id: "21", name: "Weekly Planner", category: "Productivity & Planning", description: "Plan your week ahead", slug: "weekly-planner", keywords: ["planner", "weekly", "schedule"] },
  { id: "22", name: "Monthly Calendar", category: "Productivity & Planning", description: "Monthly calendar view", slug: "monthly-calendar", keywords: ["calendar", "monthly", "schedule"] },
  { id: "23", name: "Time Blocking", category: "Productivity & Planning", description: "Block time for focused work", slug: "time-blocking", keywords: ["time", "blocking", "schedule"] },
  { id: "24", name: "Focus Stats", category: "Productivity & Planning", description: "Track your focus and productivity stats", slug: "focus-stats", keywords: ["stats", "focus", "productivity"] },
  { id: "25", name: "Stretch Reminders", category: "Productivity & Planning", description: "Regular stretch break reminders", slug: "stretch-reminders", keywords: ["stretch", "reminder", "health"] },
  { id: "26", name: "Gratitude Journal", category: "Productivity & Planning", description: "Daily gratitude practice", slug: "gratitude-journal", keywords: ["gratitude", "journal", "wellness"] },
  { id: "27", name: "Mood Tracker", category: "Productivity & Planning", description: "Track your mood over time", slug: "mood-tracker", keywords: ["mood", "tracker", "mental"] },
  { id: "28", name: "Energy Tracker", category: "Productivity & Planning", description: "Track your energy levels", slug: "energy-tracker", keywords: ["energy", "tracker", "health"] },
  { id: "29", name: "Screen Time Tracker", category: "Productivity & Planning", description: "Monitor your screen time", slug: "screen-time-tracker", keywords: ["screen", "time", "tracker"] },
  { id: "30", name: "Decision Matrix", category: "Productivity & Planning", description: "Make better decisions with a matrix", slug: "decision-matrix", keywords: ["decision", "matrix", "choice"] },
  { id: "31", name: "Pareto Analyzer", category: "Productivity & Planning", description: "80/20 rule analyzer", slug: "pareto-analyzer", keywords: ["pareto", "80/20", "analysis"] },
  { id: "32", name: "Wheel of Life", category: "Productivity & Planning", description: "Balance your life areas", slug: "wheel-of-life", keywords: ["wheel", "life", "balance"] },
  { id: "33", name: "SWOT Analysis", category: "Productivity & Planning", description: "Strengths, Weaknesses, Opportunities, Threats", slug: "swot-analysis", keywords: ["swot", "analysis", "strategy"] },
  { id: "34", name: "OKR Tracker", category: "Productivity & Planning", description: "Objectives and Key Results tracker", slug: "okr-tracker", keywords: ["okr", "objectives", "goals"] },
  { id: "35", name: "Personal KPI", category: "Productivity & Planning", description: "Track your personal key performance indicators", slug: "personal-kpi", keywords: ["kpi", "metrics", "performance"] },
  { id: "36", name: "Reading List", category: "Productivity & Planning", description: "Manage your reading list", slug: "reading-list", keywords: ["reading", "books", "list"] },
  { id: "37", name: "Book Summary", category: "Productivity & Planning", description: "Create book summaries", slug: "book-summary", keywords: ["book", "summary", "notes"] },
  { id: "38", name: "Spaced Repetition", category: "Productivity & Planning", description: "Learn with spaced repetition", slug: "spaced-repetition", keywords: ["spaced", "repetition", "learning"] },
  { id: "39", name: "Pomodoro History", category: "Productivity & Planning", description: "View your Pomodoro session history", slug: "pomodoro-history", keywords: ["pomodoro", "history", "stats"] },
  { id: "40", name: "Reflection Prompts", category: "Productivity & Planning", description: "Daily reflection prompts", slug: "reflection-prompts", keywords: ["reflection", "prompts", "journal"] },

  // Finance & Calculators (41-80)
  { id: "41", name: "Compound Interest", category: "Finance & Calculators", description: "Calculate compound interest", slug: "compound-interest", keywords: ["interest", "compound", "finance"] },
  { id: "42", name: "Retirement", category: "Finance & Calculators", description: "Retirement savings calculator", slug: "retirement", keywords: ["retirement", "savings", "finance"] },
  { id: "43", name: "Savings Goal", category: "Finance & Calculators", description: "Calculate time to reach savings goal", slug: "savings-goal", keywords: ["savings", "goal", "finance"] },
  { id: "44", name: "Net Worth", category: "Finance & Calculators", description: "Calculate your net worth", slug: "net-worth", keywords: ["net", "worth", "finance"] },
  { id: "45", name: "Expense Splitter", category: "Finance & Calculators", description: "Split expenses with friends", slug: "expense-splitter", keywords: ["expense", "split", "bill"] },
  { id: "46", name: "Bill Splitter", category: "Finance & Calculators", description: "Split bills evenly or by percentage", slug: "bill-splitter", keywords: ["bill", "split", "calculator"] },
  { id: "47", name: "Tip Calculator", category: "Finance & Calculators", description: "Calculate tip amount", slug: "tip-calculator", keywords: ["tip", "calculator", "restaurant"] },
  { id: "48", name: "Salary Calculator", category: "Finance & Calculators", description: "Calculate salary breakdown", slug: "salary-calculator", keywords: ["salary", "calculator", "income"] },
  { id: "49", name: "Freelance Rate", category: "Finance & Calculators", description: "Calculate freelance hourly rate", slug: "freelance-rate", keywords: ["freelance", "rate", "calculator"] },
  { id: "50", name: "ROI", category: "Finance & Calculators", description: "Return on Investment calculator", slug: "roi", keywords: ["roi", "return", "investment"] },
  { id: "51", name: "Break-Even", category: "Finance & Calculators", description: "Calculate break-even point", slug: "break-even", keywords: ["break", "even", "business"] },
  { id: "52", name: "Profit Margin", category: "Finance & Calculators", description: "Calculate profit margin percentage", slug: "profit-margin", keywords: ["profit", "margin", "business"] },
  { id: "53", name: "Markup", category: "Finance & Calculators", description: "Calculate markup percentage", slug: "markup", keywords: ["markup", "price", "calculator"] },
  { id: "54", name: "Discount", category: "Finance & Calculators", description: "Calculate discount amount", slug: "discount", keywords: ["discount", "price", "calculator"] },
  { id: "55", name: "Sales Tax", category: "Finance & Calculators", description: "Calculate sales tax", slug: "sales-tax", keywords: ["tax", "sales", "calculator"] },
  { id: "56", name: "VAT", category: "Finance & Calculators", description: "Calculate VAT amount", slug: "vat", keywords: ["vat", "tax", "calculator"] },
  { id: "57", name: "Crypto Profit", category: "Finance & Calculators", description: "Calculate cryptocurrency profit/loss", slug: "crypto-profit", keywords: ["crypto", "profit", "bitcoin"] },
  { id: "58", name: "Stock Tracker", category: "Finance & Calculators", description: "Track stock prices and gains", slug: "stock-tracker", keywords: ["stock", "tracker", "investing"] },
  { id: "59", name: "Mortgage", category: "Finance & Calculators", description: "Calculate mortgage payments", slug: "mortgage", keywords: ["mortgage", "loan", "house"] },
  { id: "60", name: "Car Loan", category: "Finance & Calculators", description: "Calculate car loan payments", slug: "car-loan", keywords: ["car", "loan", "auto"] },
  { id: "61", name: "Credit Card Payoff", category: "Finance & Calculators", description: "Calculate credit card payoff time", slug: "credit-card-payoff", keywords: ["credit", "card", "debt"] },
  { id: "62", name: "Debt Snowball", category: "Finance & Calculators", description: "Debt snowball calculator", slug: "debt-snowball", keywords: ["debt", "snowball", "payoff"] },
  { id: "63", name: "Emergency Fund", category: "Finance & Calculators", description: "Calculate emergency fund target", slug: "emergency-fund", keywords: ["emergency", "fund", "savings"] },
  { id: "64", name: "FIRE Calculator", category: "Finance & Calculators", description: "Financial Independence calculator", slug: "fire-calculator", keywords: ["fire", "financial", "independence"] },
  { id: "65", name: "50/30/20 Budget", category: "Finance & Calculators", description: "50/30/20 budgeting rule calculator", slug: "50-30-20-budget", keywords: ["budget", "50/30/20", "finance"] },
  { id: "66", name: "Zero-Based Budget", category: "Finance & Calculators", description: "Zero-based budgeting calculator", slug: "zero-based-budget", keywords: ["budget", "zero", "based"] },
  { id: "67", name: "Envelope Budget", category: "Finance & Calculators", description: "Envelope budgeting system", slug: "envelope-budget", keywords: ["envelope", "budget", "system"] },
  { id: "68", name: "Paycheck Planner", category: "Finance & Calculators", description: "Plan your paycheck allocation", slug: "paycheck-planner", keywords: ["paycheck", "planner", "budget"] },
  { id: "69", name: "Side Hustle Profit", category: "Finance & Calculators", description: "Calculate side hustle profitability", slug: "side-hustle-profit", keywords: ["side", "hustle", "profit"] },
  { id: "70", name: "Rental ROI", category: "Finance & Calculators", description: "Calculate rental property ROI", slug: "rental-roi", keywords: ["rental", "roi", "property"] },
  { id: "71", name: "House Affordability", category: "Finance & Calculators", description: "Calculate how much house you can afford", slug: "house-affordability", keywords: ["house", "affordability", "mortgage"] },
  { id: "72", name: "Refinance", category: "Finance & Calculators", description: "Mortgage refinance calculator", slug: "refinance", keywords: ["refinance", "mortgage", "loan"] },
  { id: "73", name: "Inflation", category: "Finance & Calculators", description: "Calculate inflation impact", slug: "inflation", keywords: ["inflation", "calculator", "money"] },
  { id: "74", name: "Currency Converter", category: "Finance & Calculators", description: "Convert between currencies", slug: "currency-converter", keywords: ["currency", "converter", "exchange"] },
  { id: "75", name: "Gold Price", category: "Finance & Calculators", description: "Check gold prices", slug: "gold-price", keywords: ["gold", "price", "precious"] },
  { id: "76", name: "Fuel Cost", category: "Finance & Calculators", description: "Calculate fuel cost for trip", slug: "fuel-cost", keywords: ["fuel", "cost", "trip"] },
  { id: "77", name: "Mileage Reimbursement", category: "Finance & Calculators", description: "Calculate mileage reimbursement", slug: "mileage-reimbursement", keywords: ["mileage", "reimbursement", "travel"] },
  { id: "78", name: "Overtime Pay", category: "Finance & Calculators", description: "Calculate overtime pay", slug: "overtime-pay", keywords: ["overtime", "pay", "wage"] },
  { id: "79", name: "Take-Home Pay", category: "Finance & Calculators", description: "Calculate take-home pay after taxes", slug: "take-home-pay", keywords: ["take", "home", "pay"] },
  { id: "80", name: "Cost of Living", category: "Finance & Calculators", description: "Compare cost of living between cities", slug: "cost-of-living", keywords: ["cost", "living", "city"] },

  // Health & Fitness (81-110)
  { id: "81", name: "BMI + BMR + TDEE", category: "Health & Fitness", description: "Calculate BMI, BMR, and TDEE", slug: "bmi-bmr-tdee", keywords: ["bmi", "bmr", "tdee", "health"] },
  { id: "82", name: "Body Fat %", category: "Health & Fitness", description: "Estimate body fat percentage", slug: "body-fat-percent", keywords: ["body", "fat", "percentage"] },
  { id: "83", name: "One Rep Max", category: "Health & Fitness", description: "Calculate one-rep max", slug: "one-rep-max", keywords: ["rep", "max", "strength"] },
  { id: "84", name: "Macro Calculator", category: "Health & Fitness", description: "Calculate macronutrients", slug: "macro-calculator", keywords: ["macro", "nutrition", "calories"] },
  { id: "85", name: "Calorie Deficit", category: "Health & Fitness", description: "Calculate calorie deficit for weight loss", slug: "calorie-deficit", keywords: ["calorie", "deficit", "weight"] },
  { id: "86", name: "Water Intake", category: "Health & Fitness", description: "Calculate daily water intake", slug: "water-intake", keywords: ["water", "intake", "hydration"] },
  { id: "87", name: "Sleep Calculator", category: "Health & Fitness", description: "Calculate optimal sleep times", slug: "sleep-calculator", keywords: ["sleep", "calculator", "rest"] },
  { id: "88", name: "Heart Rate Zones", category: "Health & Fitness", description: "Calculate heart rate training zones", slug: "heart-rate-zones", keywords: ["heart", "rate", "zones"] },
  { id: "89", name: "VO2 Max", category: "Health & Fitness", description: "Estimate VO2 max", slug: "vo2-max", keywords: ["vo2", "max", "fitness"] },
  { id: "90", name: "Pregnancy Due Date", category: "Health & Fitness", description: "Calculate pregnancy due date", slug: "pregnancy-due-date", keywords: ["pregnancy", "due", "date"] },
  { id: "91", name: "Ovulation Calendar", category: "Health & Fitness", description: "Track ovulation cycle", slug: "ovulation-calendar", keywords: ["ovulation", "calendar", "cycle"] },
  { id: "92", name: "Period Tracker", category: "Health & Fitness", description: "Track menstrual cycle", slug: "period-tracker", keywords: ["period", "tracker", "cycle"] },
  { id: "93", name: "Baby Name Generator", category: "Health & Fitness", description: "Generate baby name ideas", slug: "baby-name-generator", keywords: ["baby", "name", "generator"] },
  { id: "94", name: "Height Predictor", category: "Health & Fitness", description: "Predict adult height", slug: "height-predictor", keywords: ["height", "predictor", "growth"] },
  { id: "95", name: "Ideal Weight", category: "Health & Fitness", description: "Calculate ideal body weight", slug: "ideal-weight", keywords: ["ideal", "weight", "health"] },
  { id: "96", name: "Waist-to-Hip", category: "Health & Fitness", description: "Calculate waist-to-hip ratio", slug: "waist-to-hip", keywords: ["waist", "hip", "ratio"] },
  { id: "97", name: "Steps Tracker", category: "Health & Fitness", description: "Track daily steps", slug: "steps-tracker", keywords: ["steps", "tracker", "walking"] },
  { id: "98", name: "Workout Log", category: "Health & Fitness", description: "Log your workouts", slug: "workout-log", keywords: ["workout", "log", "exercise"] },
  { id: "99", name: "Running Pace", category: "Health & Fitness", description: "Calculate running pace", slug: "running-pace", keywords: ["running", "pace", "speed"] },
  { id: "100", name: "Marathon Predictor", category: "Health & Fitness", description: "Predict marathon finish time", slug: "marathon-predictor", keywords: ["marathon", "predictor", "running"] },
  { id: "101", name: "Cycling Power", category: "Health & Fitness", description: "Calculate cycling power", slug: "cycling-power", keywords: ["cycling", "power", "watt"] },
  { id: "102", name: "Yoga Sequence", category: "Health & Fitness", description: "Generate yoga sequences", slug: "yoga-sequence", keywords: ["yoga", "sequence", "poses"] },
  { id: "103", name: "Meditation Timer", category: "Health & Fitness", description: "Meditation timer with bells", slug: "meditation-timer", keywords: ["meditation", "timer", "mindfulness"] },
  { id: "104", name: "Breathing Exercises", category: "Health & Fitness", description: "Guided breathing exercises", slug: "breathing-exercises", keywords: ["breathing", "exercise", "relax"] },
  { id: "105", name: "Mental Health Quiz", category: "Health & Fitness", description: "Mental health assessment", slug: "mental-health-quiz", keywords: ["mental", "health", "quiz"] },
  { id: "106", name: "Anxiety Test", category: "Health & Fitness", description: "Anxiety level assessment", slug: "anxiety-test", keywords: ["anxiety", "test", "mental"] },
  { id: "107", name: "Burnout Quiz", category: "Health & Fitness", description: "Burnout risk assessment", slug: "burnout-quiz", keywords: ["burnout", "quiz", "stress"] },
  { id: "108", name: "Nutrition Lookup", category: "Health & Fitness", description: "Look up nutrition facts", slug: "nutrition-lookup", keywords: ["nutrition", "lookup", "food"] },
  { id: "109", name: "Recipe Calories", category: "Health & Fitness", description: "Calculate recipe calories", slug: "recipe-calories", keywords: ["recipe", "calories", "nutrition"] },
  { id: "110", name: "Fasting Timer", category: "Health & Fitness", description: "Intermittent fasting timer", slug: "fasting-timer", keywords: ["fasting", "timer", "intermittent"] },

  // File Converters & Editors (111-180)
  {
    id: "111",
    name: "PDF to Text",
    category: "File Converters & Editors",
    description: "Extract text from PDF files",
    slug: "pdf-to-text",
    keywords: ["pdf", "text", "extract", "convert pdf to text", "ocr", "online converter", "tool 260", "tool260", "i love pdf", "small pdf", "ilovepdf", "smallpdf", "file converters", "best pdf tools", "online pdf help"],
    longDescription: "Our free PDF to Text converter allows you to instantly extract text from any PDF document directly in your browser. Unlike other tools that upload your sensitive documents to a cloud server, Tool 260 processes your files locally using advanced JavaScript libraries. This means your data never leaves your device, ensuring 100% privacy and security. Whether you need to grab a quote from a research paper or convert an entire ebook to editable text, this tool handles it in seconds.",
    howToSteps: [
      "Click the 'Select File' button or drag and drop your PDF into the upload area.",
      "Wait a brief moment for the browser to process your file. Larger files may take a few extra seconds.",
      "Once extraction is complete, the text will appear in the result box.",
      "Click 'Copy to Clipboard' to use the text immediately, or 'Download .txt' to save it to your computer."
    ],
    features: [
      "100% Privacy: Files are processed locally, never uploaded.",
      "Formatting Retention: Preserves paragraphs and basic structure where possible.",
      "Universal Compatibility: Works on Windows, Mac, Linux, Android, and iOS.",
      "No Limits: Convert as many PDFs as you want, completely free.",
      "Fast Extraction: optimized engine for quick results."
    ],
    faqs: [
      {
        question: "Is this PDF to Text converter free?",
        answer: "Yes, it is completely free to use with no hidden fees or subscriptions."
      },
      {
        question: "Do you store my PDF files?",
        answer: "No. Your files are processed entirely within your web browser. We never see, store, or upload your documents."
      },
      {
        question: "Does it work with scanned PDFs (OCR)?",
        answer: "Currently, this tool extracts text from standard PDFs. Support for scanned image-based PDFs (OCR) is coming in a future update."
      }
    ]
  },
  { id: "112", name: "PDF to Images", category: "File Converters & Editors", description: "Convert PDF pages to images", slug: "pdf-to-images", keywords: ["pdf", "images", "convert", "pdf to img", "pdf to jpg", "pdf to png", "convert pdf to image"] },
  {
    id: "113",
    name: "Images to PDF",
    category: "File Converters & Editors",
    description: "Combine multiple images into a single PDF document",
    slug: "images-to-pdf",
    keywords: ["images to pdf", "jpg to pdf", "png to pdf", "convert image to pdf", "picture to pdf", "combine images to pdf online", "free image converter", "tool 260", "tool260", "i love pdf", "small pdf", "ilovepdf", "smallpdf", "file converters", "best images to pdf", "online image to pdf"],
    longDescription: "Turn your photos, scanned documents, and graphics into a professional PDF format with our Images to PDF converter. Whether you need to combine several JPGs for an assignment, turn PNG screenshots into a report, or archive precious photos in a single file, Tool 260 makes it easy. Your privacy is our priority: all image processing happens directly on your device inside your browser, so your private photos are never uploaded to our servers.",
    howToSteps: [
      "Select one or more images (JPG, PNG, WebP) from your device or use drag-and-drop.",
      "Rearrange the order of images if needed using the simple interface.",
      "Adjust page settings like orientation, margin, and page size.",
      "Click 'Convert to PDF' to generate your document instantly.",
      "Download the resulting PDF file to your computer or mobile device."
    ],
    features: [
      "No File Uploads: Everything stays on your local machine.",
      "Supports Multiple Formats: Convert JPG, PNG, GIF, and WebP flawlessly.",
      "Bulk Conversion: Combine dozens of images into one PDF at once.",
      "High Resolution: Maintain the original quality of your uploaded images.",
      "Cross-Platform: Works on mobile, tablet, and desktop without apps."
    ],
    faqs: [
      {
        question: "How many images can I convert at once?",
        answer: "There is no fixed limit! Since the conversion happens in your browser, it depends on your device's memory. Most users can easily combine 50+ images at a time."
      },
      {
        question: "Is there a watermark on the output PDF?",
        answer: "No. Unlike other 'free' tools, Tool260 provides a clean, watermark-free PDF every time."
      }
    ]
  },
  {
    id: "114",
    name: "Merge PDFs",
    category: "File Converters & Editors",
    description: "Combine multiple PDF files into one",
    slug: "merge-pdfs",
    keywords: ["merge pdf", "combine pdf", "join pdf", "combine pdfs online", "merge pdf files free", "pdf joiner", "tool 260", "tool260", "i love pdf", "small pdf", "ilovepdf", "smallpdf", "file converters", "best pdf merger", "online merge tool"],
    longDescription: "Simplify your digital life by merging multiple PDF files into one organized document. Our Merge PDFs tool is perfect for combining chapters of a project, gathering monthly reports, or merging signed contracts. By processing your files locally using your browser's power, Tool 260 ensures that your confidential documents are never sent across the internet, offering unparalleled speed and security compared to cloud-based alternatives.",
    howToSteps: [
      "Upload the PDF files you want to combine by clicking the selection area.",
      "Drag and drop the files to arrange them in the exact order you want them merged.",
      "Preview the file list to ensure everything is correct.",
      "Click the 'Merge' button to initiate the local joining process.",
      "Download your new, single PDF document immediately."
    ],
    features: [
      "Bank-Grade Privacy: Files never leave your browser, ensuring total confidentiality.",
      "Instant Processing: No upload/download wait times for the merging process.",
      "Preserve Formatting: Keeps all links, fonts, and layouts from original files.",
      "Order Control: Easily reorder files before merging with a simple drag-and-drop.",
      "Free Forever: No registration or daily usage limits."
    ],
    faqs: [
      {
        question: "Can I merge password-protected PDFs?",
        answer: "Yes, provided you know the password. You'll need to unlock them first using our 'Remove PDF Password' tool or enter the password when prompted."
      },
      {
        question: "Is there a limit on the total file size?",
        answer: "The limit is based on your device's RAM. Most modern browsers can handle merging files totaling hundreds of megabytes without issue."
      }
    ]
  },
  { id: "115", name: "Split PDF", category: "File Converters & Editors", description: "Split PDF into multiple files", slug: "split-pdf", keywords: ["split", "pdf", "divide"] },
  { id: "116", name: "Compress PDF", category: "File Converters & Editors", description: "Reduce PDF file size", slug: "compress-pdf", keywords: ["compress", "pdf", "size"] },
  { id: "117", name: "Rotate PDF", category: "File Converters & Editors", description: "Rotate PDF pages", slug: "rotate-pdf", keywords: ["rotate", "pdf", "pages"] },
  { id: "118", name: "Watermark PDF", category: "File Converters & Editors", description: "Add watermark to PDF", slug: "watermark-pdf", keywords: ["watermark", "pdf", "add"] },
  { id: "119", name: "Remove PDF Password", category: "File Converters & Editors", description: "Remove password from PDF", slug: "remove-pdf-password", keywords: ["remove", "password", "pdf"] },
  { id: "120", name: "Markdown Editor", category: "Text & Code Tools", description: "Write and preview Markdown", slug: "markdown-editor", keywords: ["markdown", "editor", "preview", "live markdown", "online editor", "tool260"] },

  { id: "138", name: "JSON Minifier", category: "Text & Code Tools", description: "Minify JSON code", slug: "json-minifier", keywords: ["json", "minify", "compress"] },
  { id: "139", name: "CSS Minifier", category: "Text & Code Tools", description: "Minify CSS code", slug: "css-minifier", keywords: ["css", "minify", "compress"] },
  { id: "140", name: "JavaScript Minifier", category: "Text & Code Tools", description: "Minify JavaScript code", slug: "javascript-minifier", keywords: ["javascript", "minify", "compress"] },
  { id: "141", name: "SQL Minifier", category: "Text & Code Tools", description: "Minify SQL queries", slug: "sql-minifier", keywords: ["sql", "minify", "compress"] },
  { id: "142", name: "HTML Minifier", category: "Text & Code Tools", description: "Minify HTML code", slug: "html-minifier", keywords: ["html", "minify", "compress"] },
  { id: "143", name: "XML Minifier", category: "Text & Code Tools", description: "Minify XML code", slug: "xml-minifier", keywords: ["xml", "minify", "compress"] },

  { id: "121", name: "Word to PDF", category: "File Converters & Editors", description: "Convert Word documents to PDF", slug: "word-to-pdf", keywords: ["word", "pdf", "convert", "doc to pdf", "docx to pdf", "convert word to pdf free", "word 2 pdf"] },
  { id: "122", name: "Excel to PDF", category: "File Converters & Editors", description: "Convert Excel to PDF", slug: "excel-to-pdf", keywords: ["excel", "pdf", "convert"] },
  { id: "123", name: "PPT to PDF", category: "File Converters & Editors", description: "Convert PowerPoint to PDF", slug: "ppt-to-pdf", keywords: ["powerpoint", "pdf", "convert"] },
  { id: "124", name: "HTML to PDF", category: "File Converters & Editors", description: "Convert HTML to PDF", slug: "html-to-pdf", keywords: ["html", "pdf", "convert"] },
  { id: "125", name: "Markdown to PDF", category: "File Converters & Editors", description: "Convert Markdown to PDF", slug: "markdown-to-pdf", keywords: ["markdown", "pdf", "convert"] },
  { id: "126", name: "JSON to CSV", category: "File Converters & Editors", description: "Convert JSON to CSV", slug: "json-to-csv", keywords: ["json", "csv", "convert"] },
  { id: "127", name: "CSV to JSON", category: "File Converters & Editors", description: "Convert CSV to JSON", slug: "csv-to-json", keywords: ["csv", "json", "convert"] },
  { id: "128", name: "JSON to Excel", category: "File Converters & Editors", description: "Convert JSON to Excel", slug: "json-to-excel", keywords: ["json", "excel", "convert"] },
  { id: "129", name: "Excel to JSON", category: "File Converters & Editors", description: "Convert Excel to JSON", slug: "excel-to-json", keywords: ["excel", "json", "convert"] },
  { id: "130", name: "CSV Editor", category: "File Converters & Editors", description: "Edit CSV files online", slug: "csv-editor", keywords: ["csv", "editor", "edit"] },
  { id: "131", name: "Base64 Encode/Decode", category: "File Converters & Editors", description: "Encode and decode Base64", slug: "base64-encode-decode", keywords: ["base64", "encode", "decode"] },
  { id: "132", name: "URL Encode/Decode", category: "File Converters & Editors", description: "Encode and decode URLs", slug: "url-encode-decode", keywords: ["url", "encode", "decode"] },
  { id: "133", name: "HTML Entity", category: "File Converters & Editors", description: "Convert HTML entities", slug: "html-entity", keywords: ["html", "entity", "convert"] },
  { id: "134", name: "Markdown to HTML", category: "File Converters & Editors", description: "Convert Markdown to HTML", slug: "markdown-to-html", keywords: ["markdown", "html", "convert"] },
  { id: "135", name: "HTML to Markdown", category: "File Converters & Editors", description: "Convert HTML to Markdown", slug: "html-to-markdown", keywords: ["html", "markdown", "convert"] },
  { id: "136", name: "Text to PDF", category: "File Converters & Editors", description: "Convert text to PDF", slug: "text-to-pdf", keywords: ["text", "pdf", "convert"] },
  { id: "137", name: "Image Compressor", category: "File Converters & Editors", description: "Compress images online", slug: "image-compressor", keywords: ["image", "compress", "size", "reduce image size", "tiny png", "optimize images"] },
  { id: "144", name: "Remove BG", category: "File Converters & Editors", description: "Remove background from images", slug: "remove-bg", keywords: ["background", "remove", "image"] },
  { id: "145", name: "EXIF Viewer", category: "File Converters & Editors", description: "View image EXIF data", slug: "exif-viewer", keywords: ["exif", "viewer", "metadata"] },
  { id: "147", name: "PNG to ICO", category: "File Converters & Editors", description: "Convert PNG to ICO", slug: "png-to-ico", keywords: ["png", "ico", "convert"] },
  { id: "148", name: "Bulk Renamer", category: "File Converters & Editors", description: "Rename multiple files", slug: "bulk-renamer", keywords: ["bulk", "rename", "files"] },
  { id: "149", name: "File Type Detector", category: "File Converters & Editors", description: "Detect file type", slug: "file-type-detector", keywords: ["file", "type", "detector"] },
  { id: "150", name: "XML to JSON", category: "File Converters & Editors", description: "Convert XML to JSON", slug: "xml-to-json", keywords: ["xml", "json", "convert"] },
  { id: "151", name: "JSON to XML", category: "File Converters & Editors", description: "Convert JSON to XML", slug: "json-to-xml", keywords: ["json", "xml", "convert"] },
  { id: "152", name: "YAML to JSON", category: "File Converters & Editors", description: "Convert YAML to JSON", slug: "yaml-to-json", keywords: ["yaml", "json", "convert"] },
  { id: "153", name: "JSON to YAML", category: "File Converters & Editors", description: "Convert JSON to YAML", slug: "json-to-yaml", keywords: ["json", "yaml", "convert"] },
  { id: "154", name: "TOML to JSON", category: "File Converters & Editors", description: "Convert TOML to JSON", slug: "toml-to-json", keywords: ["toml", "json", "convert"] },
  { id: "155", name: "JSON to TOML", category: "File Converters & Editors", description: "Convert JSON to TOML", slug: "json-to-toml", keywords: ["json", "toml", "convert"] },
  { id: "156", name: "RTF to PDF", category: "File Converters & Editors", description: "Convert RTF to PDF", slug: "rtf-to-pdf", keywords: ["rtf", "pdf", "convert"] },
  { id: "157", name: "EPUB to PDF", category: "File Converters & Editors", description: "Convert EPUB to PDF", slug: "epub-to-pdf", keywords: ["epub", "pdf", "convert"] },
  { id: "158", name: "PDF to EPUB", category: "File Converters & Editors", description: "Convert PDF to EPUB", slug: "pdf-to-epub", keywords: ["pdf", "epub", "convert"] },
  { id: "159", name: "ODT to PDF", category: "File Converters & Editors", description: "Convert ODT to PDF", slug: "odt-to-pdf", keywords: ["odt", "pdf", "convert"] },

  { id: "163", name: "JPG to PNG", category: "File Converters & Editors", description: "Convert JPG to PNG", slug: "jpg-to-png", keywords: ["jpg", "png", "convert", "image converter", "convert jpg to png"] },
  { id: "164", name: "PNG to JPG", category: "File Converters & Editors", description: "Convert PNG to JPG", slug: "png-to-jpg", keywords: ["png", "jpg", "convert"] },
  { id: "165", name: "WEBP Converter", category: "File Converters & Editors", description: "Convert to/from WEBP", slug: "webp-converter", keywords: ["webp", "convert", "image"] },
  { id: "166", name: "GIF Maker", category: "File Converters & Editors", description: "Create GIF from images", slug: "gif-maker", keywords: ["gif", "maker", "create"] },
  { id: "167", name: "Video to GIF", category: "File Converters & Editors", description: "Convert video to GIF", slug: "video-to-gif", keywords: ["video", "gif", "convert"] },
  { id: "168", name: "Audio Converter", category: "File Converters & Editors", description: "Convert audio formats", slug: "audio-converter", keywords: ["audio", "convert", "format"] },

  { id: "170", name: "ZIP Extractor", category: "File Converters & Editors", description: "Extract ZIP files", slug: "zip-extractor", keywords: ["zip", "extract", "archive"] },
  { id: "171", name: "ZIP Creator", category: "File Converters & Editors", description: "Create ZIP archives", slug: "zip-creator", keywords: ["zip", "create", "archive"] },
  { id: "172", name: "RAR Extractor", category: "File Converters & Editors", description: "Extract RAR files", slug: "rar-extractor", keywords: ["rar", "extract", "archive"] },
  { id: "173", name: "7Z Extractor", category: "File Converters & Editors", description: "Extract 7Z files", slug: "7z-extractor", keywords: ["7z", "extract", "archive"] },
  { id: "174", name: "TAR Extractor", category: "File Converters & Editors", description: "Extract TAR files", slug: "tar-extractor", keywords: ["tar", "extract", "archive"] },
  { id: "175", name: "File Merger", category: "File Converters & Editors", description: "Merge multiple files", slug: "file-merger", keywords: ["merge", "files", "combine"] },
  { id: "176", name: "File Splitter", category: "File Converters & Editors", description: "Split large files", slug: "file-splitter", keywords: ["split", "files", "divide"] },
  { id: "177", name: "Hash Generator", category: "File Converters & Editors", description: "Generate file hashes", slug: "hash-generator", keywords: ["hash", "generator", "checksum"] },
  { id: "178", name: "File Comparator", category: "File Converters & Editors", description: "Compare two files", slug: "file-comparator", keywords: ["compare", "files", "diff"] },
  { id: "179", name: "Duplicate Finder", category: "File Converters & Editors", description: "Find duplicate files", slug: "duplicate-finder", keywords: ["duplicate", "finder", "files"] },
  { id: "180", name: "File Validator", category: "File Converters & Editors", description: "Validate file formats", slug: "file-validator", keywords: ["validate", "file", "format"] },

  // Text & Code Tools (181-200)
  {
    id: "181",
    name: "JSON Formatter",
    category: "Text & Code Tools",
    description: "Format and validate JSON",
    slug: "json-formatter",
    keywords: ["json", "formatter", "validate"],
    longDescription: "Debug, validate, and beautify your JSON data with our instant JSON Formatter. Developers know the pain of staring at minified JSON strings. Our tool automatically formats your ugly JSON into a readable, indented structure with syntax highlighting. It also validates your JSON in real-time, pointing out syntax errors so you can fix them quickly. Perfect for API development, configuration files, and debugging.",
    howToSteps: [
      "Paste your raw/minified JSON string into the input editor.",
      "The tool will automatically validate your code. If there are errors, they will be highlighted.",
      "Click 'Format' to beautify the JSON with proper indentation.",
      "Use the 'Copy' button to grab the formatted code or 'Download' to save it as a .json file."
    ],
    features: [
      "Syntax Validation: Instantly catch missing commas or brackets.",
      "Auto-Indentation: Makes complex nested objects easy to read.",
      "Collapsible Nodes: Fold and unfold objects to focus on what matters.",
      "Dark Mode Support: Easy on the eyes for late-night coding sessions.",
      "Local Processing: Your data stays in your browser."
    ],
    faqs: [
      {
        question: "Why is my JSON showing as invalid?",
        answer: "Common reasons include missing quotes around keys, trailing commas, or using single quotes instead of double quotes. Our tool highlights the exact line number of the error."
      },
      {
        question: "Can I format large JSON files?",
        answer: "Yes! Since we process data locally in your browser, you can handle large files without waiting for server uploads."
      }
    ]
  },
  { id: "182", name: "XML Formatter", category: "Text & Code Tools", description: "Format XML code", slug: "xml-formatter", keywords: ["xml", "formatter", "format"] },
  { id: "183", name: "SQL Formatter", category: "Text & Code Tools", description: "Format SQL queries", slug: "sql-formatter", keywords: ["sql", "formatter", "query"] },
  { id: "184", name: "CSS Formatter", category: "Text & Code Tools", description: "Format CSS code", slug: "css-formatter", keywords: ["css", "formatter", "format"] },
  { id: "185", name: "HTML Formatter", category: "Text & Code Tools", description: "Format HTML code", slug: "html-formatter", keywords: ["html", "formatter", "format"] },
  { id: "186", name: "JavaScript Formatter", category: "Text & Code Tools", description: "Format JavaScript code", slug: "javascript-formatter", keywords: ["javascript", "formatter", "format"] },
  { id: "187", name: "Python Formatter", category: "Text & Code Tools", description: "Format Python code", slug: "python-formatter", keywords: ["python", "formatter", "format"] },
  { id: "188", name: "Text Diff", category: "Text & Code Tools", description: "Compare two texts", slug: "text-diff", keywords: ["diff", "compare", "text"] },
  { id: "189", name: "Word Counter", category: "Text & Code Tools", description: "Count words, characters, paragraphs", slug: "word-counter", keywords: ["word", "counter", "count"] },
  { id: "190", name: "Case Converter", category: "Text & Code Tools", description: "Convert text case", slug: "case-converter", keywords: ["case", "convert", "text"] },
  { id: "191", name: "Text Reverser", category: "Text & Code Tools", description: "Reverse text", slug: "text-reverser", keywords: ["reverse", "text", "flip"] },
  { id: "192", name: "Lorem Ipsum Generator", category: "Text & Code Tools", description: "Generate placeholder text", slug: "lorem-ipsum-generator", keywords: ["lorem", "ipsum", "placeholder"] },
  { id: "193", name: "Password Generator", category: "Text & Code Tools", description: "Generate secure passwords", slug: "password-generator", keywords: ["password", "generator", "secure"], affiliateLinks: [{ name: "NordVPN", url: "https://nordvpn.com", description: "Secure VPN service" }, { name: "1Password", url: "https://1password.com", description: "Password manager" }] },
  { id: "194", name: "QR Code Generator", category: "Text & Code Tools", description: "Generate QR codes", slug: "qr-code-generator", keywords: ["qr", "code", "generator"] },
  { id: "195", name: "Barcode Generator", category: "Text & Code Tools", description: "Generate barcodes", slug: "barcode-generator", keywords: ["barcode", "generator", "create"] },
  { id: "196", name: "UUID Generator", category: "Text & Code Tools", description: "Generate UUIDs", slug: "uuid-generator", keywords: ["uuid", "generator", "unique"] },
  { id: "197", name: "Hash Generator", category: "Text & Code Tools", description: "Generate text hashes", slug: "hash-generator-text", keywords: ["hash", "generator", "text"] },
  { id: "198", name: "JWT Decoder", category: "Text & Code Tools", description: "Decode JWT tokens", slug: "jwt-decoder", keywords: ["jwt", "decoder", "token"] },
  { id: "199", name: "Regex Tester", category: "Text & Code Tools", description: "Test regular expressions", slug: "regex-tester", keywords: ["regex", "tester", "pattern"] },
  { id: "200", name: "Escape/Unescape", category: "Text & Code Tools", description: "Escape and unescape strings", slug: "escape-unescape", keywords: ["escape", "unescape", "string"] },

  // Image & Design Tools (201-210)
  {
    id: "201",
    name: "Image Resizer",
    category: "Image & Design Tools",
    description: "Resize images to any dimensions",
    slug: "image-resizer",
    keywords: ["image", "resize", "dimensions"],
    longDescription: "Resize your images to the perfect dimensions for social media, websites, or printing without losing quality. Our Image Resizer supports all major formats including JPG, PNG, and WebP. You can resize by percentage or set exact pixel dimensions. Best of all, it works entirely in your browser, so you never have to worry about uploading personal photos to a stranger's server.",
    howToSteps: [
      "Upload your image by dragging it onto the page or clicking the upload area.",
      "Enter your desired width and height in pixels, or use the percentage slider.",
      "Select 'Maintain Aspect Ratio' to prevent distortion (optional).",
      "Click 'Resize Image' and then download your perfectly sized photo."
    ],
    features: [
      "Privacy First: Photos are processed locally on your device.",
      "High Quality: Smart algorithms ensure your images stay crisp.",
      "Format Support: Works with JPG, PNG, WebP, and GIF.",
      "Aspect Ratio Lock: easy way to scale images without stretching them.",
      "Bulk Processing: (Coming Soon) Resize multiple images at once."
    ],
    faqs: [
      {
        question: "Will resizing reduce my image quality?",
        answer: "Making an image smaller usually preserves quality perfectly. Making an image much larger than original may result in some pixelation, but our tool tries to smooth this out."
      },
      {
        question: "What is the maximum file size?",
        answer: "Since we process in the browser, you are limited only by your device's memory, not by our server limits. Most users can resize images up to 50MB easily."
      }
    ]
  },
  { id: "202", name: "Image Cropper", category: "Image & Design Tools", description: "Crop images with precision", slug: "image-cropper", keywords: ["image", "crop", "edit"] },
  { id: "203", name: "Image Converter", category: "Image & Design Tools", description: "Convert between image formats (JPG, PNG, WEBP, etc.)", slug: "image-converter", keywords: ["image", "convert", "format"] },
  { id: "204", name: "Remove Background", category: "Image & Design Tools", description: "Remove background from images automatically", slug: "remove-background", keywords: ["background", "remove", "transparent"] },
  { id: "205", name: "Add Text to Image", category: "Image & Design Tools", description: "Add custom text overlays to images", slug: "add-text-to-image", keywords: ["text", "image", "overlay", "watermark"] },
  { id: "206", name: "Image to Base64", category: "Image & Design Tools", description: "Convert images to Base64 encoding", slug: "image-to-base64", keywords: ["image", "base64", "encode"] },
  { id: "207", name: "Base64 to Image", category: "Image & Design Tools", description: "Convert Base64 strings to images", slug: "base64-to-image", keywords: ["base64", "image", "decode"] },
  { id: "208", name: "SVG to PNG", category: "Image & Design Tools", description: "Convert SVG files to PNG images", slug: "svg-to-png", keywords: ["svg", "png", "convert"] },
  { id: "209", name: "Favicon Generator", category: "Image & Design Tools", description: "Generate favicons from images", slug: "favicon-generator", keywords: ["favicon", "icon", "generator"] },
  { id: "210", name: "Color Picker", category: "Image & Design Tools", description: "Pick colors from images or generate color codes", slug: "color-picker", keywords: ["color", "picker", "hex", "rgb"] },

  // Fun & Entertainment (211-240)
  { id: "211", name: "Yes/No Wheel", category: "Fun & Entertainment", description: "Spin the yes/no wheel", slug: "yes-no-wheel", keywords: ["yes", "no", "wheel"] },
  { id: "212", name: "Random Number Wheel", category: "Fun & Entertainment", description: "Random number generator wheel", slug: "random-number-wheel", keywords: ["random", "number", "wheel"] },
  { id: "213", name: "Coin Flipper", category: "Fun & Entertainment", description: "Flip a coin", slug: "coin-flipper", keywords: ["coin", "flip", "random"] },
  { id: "214", name: "Dice Roller", category: "Fun & Entertainment", description: "Roll dice", slug: "dice-roller", keywords: ["dice", "roll", "random"] },
  { id: "215", name: "Name Picker", category: "Fun & Entertainment", description: "Pick a random name", slug: "name-picker", keywords: ["name", "picker", "random"] },
  { id: "216", name: "Wheel of Names", category: "Fun & Entertainment", description: "Spin the wheel of names", slug: "wheel-of-names", keywords: ["wheel", "names", "spin"] },
  { id: "217", name: "Truth or Dare", category: "Fun & Entertainment", description: "Play truth or dare", slug: "truth-or-dare", keywords: ["truth", "dare", "game"] },
  { id: "218", name: "Would You Rather", category: "Fun & Entertainment", description: "Would you rather questions", slug: "would-you-rather", keywords: ["would", "rather", "questions"] },
  { id: "219", name: "This or That", category: "Fun & Entertainment", description: "This or that game", slug: "this-or-that", keywords: ["this", "that", "game"] },
  { id: "220", name: "Love Calculator", category: "Fun & Entertainment", description: "Calculate love compatibility", slug: "love-calculator", keywords: ["love", "calculator", "compatibility"] },
  { id: "221", name: "Magic 8-Ball", category: "Fun & Entertainment", description: "Ask the magic 8-ball", slug: "magic-8-ball", keywords: ["magic", "8-ball", "fortune"] },
  { id: "222", name: "Personality Quiz", category: "Fun & Entertainment", description: "Take a personality quiz", slug: "personality-quiz", keywords: ["personality", "quiz", "test"] },
  { id: "223", name: "Random Country", category: "Fun & Entertainment", description: "Get a random country", slug: "random-country", keywords: ["random", "country", "world"] },
  { id: "224", name: "Movie Picker", category: "Fun & Entertainment", description: "Pick a random movie", slug: "movie-picker", keywords: ["movie", "picker", "random"] },
  { id: "225", name: "Password Wheel", category: "Fun & Entertainment", description: "Generate password with wheel", slug: "password-wheel", keywords: ["password", "wheel", "generator"] },
  { id: "226", name: "Mood Picker", category: "Fun & Entertainment", description: "Pick your mood", slug: "mood-picker", keywords: ["mood", "picker", "emotion"] },
  { id: "227", name: "Excuse Generator", category: "Fun & Entertainment", description: "Generate excuses", slug: "excuse-generator", keywords: ["excuse", "generator", "funny"] },
  { id: "228", name: "Roast Generator", category: "Fun & Entertainment", description: "Generate roasts", slug: "roast-generator", keywords: ["roast", "generator", "funny"] },
  { id: "229", name: "Fake Tweet", category: "Fun & Entertainment", description: "Create fake tweets", slug: "fake-tweet", keywords: ["fake", "tweet", "twitter"] },
  { id: "230", name: "Fake Instagram", category: "Fun & Entertainment", description: "Create fake Instagram posts", slug: "fake-instagram", keywords: ["fake", "instagram", "post"] },
  { id: "231", name: "Fake YouTube", category: "Fun & Entertainment", description: "Create fake YouTube thumbnails", slug: "fake-youtube", keywords: ["fake", "youtube", "thumbnail"] },
  { id: "232", name: "Meme Caption", category: "Fun & Entertainment", description: "Add captions to memes", slug: "meme-caption", keywords: ["meme", "caption", "funny"] },
  { id: "233", name: "Emoji Story", category: "Fun & Entertainment", description: "Create emoji stories", slug: "emoji-story", keywords: ["emoji", "story", "create"] },
  { id: "234", name: "Typing Test", category: "Fun & Entertainment", description: "Test your typing speed", slug: "typing-test", keywords: ["typing", "test", "speed"] },
  { id: "235", name: "Reaction Time", category: "Fun & Entertainment", description: "Test your reaction time", slug: "reaction-time", keywords: ["reaction", "time", "test"] },
  { id: "236", name: "Color Blindness", category: "Fun & Entertainment", description: "Color blindness test", slug: "color-blindness", keywords: ["color", "blindness", "test"] },
  { id: "237", name: "Hearing Test", category: "Fun & Entertainment", description: "Test your hearing", slug: "hearing-test", keywords: ["hearing", "test", "audio"] },
  { id: "238", name: "Age in Seconds", category: "Fun & Entertainment", description: "Calculate age in seconds", slug: "age-in-seconds", keywords: ["age", "seconds", "calculate"] },
  { id: "239", name: "Days Until", category: "Fun & Entertainment", description: "Count days until event", slug: "days-until", keywords: ["days", "until", "countdown"] },
  { id: "240", name: "Tarot Reader", category: "Fun & Entertainment", description: "Virtual tarot reading", slug: "tarot-reader", keywords: ["tarot", "reader", "fortune"] },

  // Generators & Makers (241-250)
  { id: "241", name: "Gradient Generator", category: "Generators & Makers", description: "Generate CSS gradients", slug: "gradient-generator", keywords: ["gradient", "generator", "css"] },
  { id: "242", name: "Color Palette", category: "Generators & Makers", description: "Generate color palettes", slug: "color-palette", keywords: ["color", "palette", "generator"] },
  { id: "243", name: "Color Blind Simulator", category: "Generators & Makers", description: "Simulate color blindness", slug: "color-blind-simulator", keywords: ["color", "blind", "simulator"] },
  { id: "244", name: "Box Shadow", category: "Generators & Makers", description: "Generate box shadows", slug: "box-shadow", keywords: ["box", "shadow", "css"] },
  { id: "245", name: "Text Shadow", category: "Generators & Makers", description: "Generate text shadows", slug: "text-shadow", keywords: ["text", "shadow", "css"] },
  { id: "246", name: "Border Radius", category: "Generators & Makers", description: "Generate border radius", slug: "border-radius", keywords: ["border", "radius", "css"] },
  { id: "247", name: "CSS Cursor", category: "Generators & Makers", description: "CSS cursor generator", slug: "css-cursor", keywords: ["css", "cursor", "generator"] },
  { id: "248", name: "Button Generator", category: "Generators & Makers", description: "Generate CSS buttons", slug: "button-generator", keywords: ["button", "generator", "css"] },
  { id: "249", name: "Glassmorphism", category: "Generators & Makers", description: "Glassmorphism CSS generator", slug: "glassmorphism", keywords: ["glassmorphism", "css", "generator"] },
  { id: "250", name: "Neumorphism", category: "Generators & Makers", description: "Neumorphism CSS generator", slug: "neumorphism", keywords: ["neumorphism", "css", "generator"] },

  // Web & SEO Tools (251-260)
  { id: "251", name: "Flexbox Playground", category: "Web & SEO Tools", description: "CSS Flexbox playground", slug: "flexbox-playground", keywords: ["flexbox", "css", "playground"] },
  { id: "252", name: "Grid Playground", category: "Web & SEO Tools", description: "CSS Grid playground", slug: "grid-playground", keywords: ["grid", "css", "playground"] },
  { id: "253", name: "Responsive Tester", category: "Web & SEO Tools", description: "Test responsive designs", slug: "responsive-tester", keywords: ["responsive", "tester", "design"] },
  { id: "254", name: "OpenGraph Generator", category: "Web & SEO Tools", description: "Generate OpenGraph tags", slug: "opengraph-generator", keywords: ["opengraph", "generator", "seo"] },
  { id: "255", name: "Meta Tag Generator", category: "Web & SEO Tools", description: "Generate meta tags", slug: "meta-tag-generator", keywords: ["meta", "tag", "seo"] },
  { id: "256", name: "Robots.txt", category: "Web & SEO Tools", description: "Generate robots.txt", slug: "robots-txt", keywords: ["robots", "txt", "seo"] },
  { id: "257", name: "Sitemap.xml", category: "Web & SEO Tools", description: "Generate sitemap.xml", slug: "sitemap-xml", keywords: ["sitemap", "xml", "seo"] },
  { id: "258", name: "Password Strength", category: "Web & SEO Tools", description: "Check password strength", slug: "password-strength", keywords: ["password", "strength", "check"] },
  { id: "259", name: "Regex Tester SEO", category: "Web & SEO Tools", description: "Test regular expressions", slug: "regex-tester-seo", keywords: ["regex", "tester", "pattern"] },


  // Time & Utilities (261-266)
  { id: "261", name: "HTML Entities", category: "Time & Utilities", description: "HTML entity reference", slug: "html-entities", keywords: ["html", "entities", "reference"] },
  { id: "262", name: "ASCII Art", category: "Time & Utilities", description: "Generate ASCII art", slug: "ascii-art", keywords: ["ascii", "art", "generator"] },
  { id: "263", name: "Emoji Picker", category: "Time & Utilities", description: "Pick emojis", slug: "emoji-picker", keywords: ["emoji", "picker", "select"] },
  { id: "264", name: "Tally Counter", category: "Time & Utilities", description: "Count anything", slug: "tally-counter", keywords: ["tally", "counter", "count"] },
  { id: "265", name: "Invoice Generator", category: "Time & Utilities", description: "Generate invoices", slug: "invoice-generator", keywords: ["invoice", "generator", "business"] },
  { id: "266", name: "World Clock Pro", category: "Time & Utilities", description: "Advanced world clock", slug: "world-clock-pro", keywords: ["world", "clock", "timezone"] },
];

export const getToolBySlug = (slug: string): Tool | undefined => {
  return tools.find(tool => tool.slug === slug);
};

export const getToolsByCategory = (category: string): Tool[] => {
  return tools.filter(tool => tool.category === category);
};

export const searchTools = (query: string): Tool[] => {
  const lowerQuery = query.toLowerCase().trim();

  const results = tools.filter(tool =>
    tool.name.toLowerCase().includes(lowerQuery) ||
    tool.description.toLowerCase().includes(lowerQuery) ||
    tool.keywords.some(kw => kw.toLowerCase().includes(lowerQuery))
  );

  // Prioritize homepage entry for tool260 variations
  const tool260Variations = ['tool260', 'tool 260', 'tool260.com', 'tool 260 com'];
  const isSearchingForTool260 = tool260Variations.some(variation =>
    lowerQuery === variation || lowerQuery.replace(/\s+/g, '') === variation.replace(/\s+/g, '')
  );

  if (isSearchingForTool260) {
    // Move homepage entry to the top
    return results.sort((a, b) => {
      if (a.id === "0") return -1;
      if (b.id === "0") return 1;
      return 0;
    });
  }

  return results;
};

