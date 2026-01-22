#!/bin/bash

# Install PDF libraries for admin dashboard PDF export feature

echo ""
echo "========================================"
echo "Installing PDF Export Libraries..."
echo "========================================"
echo ""

cd Frontend

echo "Installing jspdf and jspdf-autotable..."
npm install jspdf jspdf-autotable

echo ""
echo "========================================"
echo "Installation Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Restart the development server (npm run dev)"
echo "2. Go to http://localhost:5173/AllOrders"
echo "3. Click the 'Download PDF' button"
echo ""
echo "For more info, see: PDF_DOWNLOAD_GUIDE.md"
echo ""
