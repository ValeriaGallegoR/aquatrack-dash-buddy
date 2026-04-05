import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const REPORT_DATA = [
  ['6am', '8'], ['7am', '10'], ['8am', '12'], ['9am', '14'], ['10am', '15'],
  ['11am', '16'], ['12pm', '17'], ['1pm', '18'], ['2pm', '19'], ['3pm', '20'],
  ['4pm', '21'], ['5pm', '22'], ['6pm', '23'], ['7pm', '24'], ['8pm', '25'],
  ['9pm', '27'], ['10pm', '28'],
];

const USAGE_VALUES = REPORT_DATA.map(([, v]) => Number(v));

export function downloadAquaTrackReport() {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const primary = [14, 165, 233]; // sky-500 approximation
  let y = 20;

  // --- Header ---
  doc.setFillColor(primary[0], primary[1], primary[2]);
  doc.rect(0, 0, pageWidth, 38, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('💧 AquaTrack', 14, 14);

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Water Usage Report', 14, 28);
  y = 48;

  // --- Report Info ---
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Report Information', 14, y);
  y += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Date Range: Last 7 Days`, 14, y);
  y += 6;
  doc.text(`Scope: All Sensors`, 14, y);
  y += 12;

  // --- Summary ---
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary', 14, y);
  y += 8;

  const summaryItems = [
    { label: 'Total Usage', value: '306 L' },
    { label: 'Average Daily Usage', value: '18 L' },
    { label: 'Peak Usage Time', value: '9–10 PM' },
  ];

  const cardW = (pageWidth - 28 - 16) / 3;
  summaryItems.forEach((item, i) => {
    const x = 14 + i * (cardW + 8);
    doc.setFillColor(240, 248, 255);
    doc.roundedRect(x, y, cardW, 22, 3, 3, 'F');
    doc.setDrawColor(200, 220, 240);
    doc.roundedRect(x, y, cardW, 22, 3, 3, 'S');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 120, 120);
    doc.text(item.label, x + 5, y + 8);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text(item.value, x + 5, y + 18);
  });
  y += 32;

  // --- Daily Usage Table ---
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Daily Usage Breakdown', 14, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [['Time', 'Usage (L)']],
    body: REPORT_DATA,
    theme: 'grid',
    headStyles: {
      fillColor: [primary[0], primary[1], primary[2]],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: { fontSize: 9, textColor: [50, 50, 50] },
    alternateRowStyles: { fillColor: [245, 250, 255] },
    margin: { left: 14, right: 14 },
    columnStyles: { 1: { halign: 'right' } },
  });

  y = (doc as any).lastAutoTable.finalY + 12;

  // --- Chart ---
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Usage Trend', 14, y);
  y += 6;

  const chartX = 14;
  const chartW = pageWidth - 28;
  const chartH = 50;
  const maxVal = Math.max(...USAGE_VALUES);
  const minVal = Math.min(...USAGE_VALUES);
  const range = maxVal - minVal || 1;

  // Chart background
  doc.setFillColor(250, 252, 255);
  doc.roundedRect(chartX, y, chartW, chartH, 2, 2, 'F');
  doc.setDrawColor(220, 230, 240);
  doc.roundedRect(chartX, y, chartW, chartH, 2, 2, 'S');

  // Grid lines
  doc.setDrawColor(230, 235, 240);
  doc.setLineWidth(0.2);
  for (let g = 0; g <= 4; g++) {
    const gy = y + chartH - (g / 4) * (chartH - 10) - 5;
    doc.line(chartX + 5, gy, chartX + chartW - 5, gy);
  }

  // Line chart
  const points = USAGE_VALUES.map((v, i) => ({
    x: chartX + 8 + (i / (USAGE_VALUES.length - 1)) * (chartW - 16),
    y: y + chartH - 5 - ((v - minVal) / range) * (chartH - 15),
  }));

  // Area fill
  doc.setFillColor(primary[0], primary[1], primary[2], 0.08);
  const areaPath: number[] = [];
  // Use lines for the fill polygon
  doc.setFillColor(220, 240, 255);
  doc.setDrawColor(220, 240, 255);
  // Draw filled polygon manually
  const polyX = points.map(p => p.x);
  const polyY = points.map(p => p.y);
  // Simple approach: just draw the line
  doc.setDrawColor(primary[0], primary[1], primary[2]);
  doc.setLineWidth(1.5);
  for (let i = 0; i < points.length - 1; i++) {
    doc.line(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
  }

  // Dots
  points.forEach((p) => {
    doc.setFillColor(primary[0], primary[1], primary[2]);
    doc.circle(p.x, p.y, 1.5, 'F');
  });

  // X-axis labels (every 4th)
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(140, 140, 140);
  REPORT_DATA.forEach(([label], i) => {
    if (i % 4 === 0 || i === REPORT_DATA.length - 1) {
      doc.text(label, points[i].x, y + chartH + 4, { align: 'center' });
    }
  });

  y += chartH + 14;

  // --- Insights ---
  // Check if we need a new page
  if (y > doc.internal.pageSize.getHeight() - 50) {
    doc.addPage();
    y = 20;
  }

  doc.setTextColor(60, 60, 60);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Insights', 14, y);
  y += 8;

  const insights = [
    'Usage increased by 27% compared to last week.',
    'Peak usage occurs in evening hours.',
    'Trend shows steady increase throughout the day.',
  ];

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  insights.forEach((text) => {
    doc.setFillColor(primary[0], primary[1], primary[2]);
    doc.circle(19, y - 1.5, 1.5, 'F');
    doc.setTextColor(70, 70, 70);
    doc.text(text, 24, y);
    y += 7;
  });

  // --- Footer ---
  y += 8;
  doc.setDrawColor(200, 210, 220);
  doc.setLineWidth(0.3);
  doc.line(14, y, pageWidth - 14, y);
  y += 6;
  doc.setFontSize(8);
  doc.setTextColor(160, 160, 160);
  doc.text(`Generated by AquaTrack · ${new Date().toLocaleDateString()}`, 14, y);

  doc.save('AquaTrack_Water_Usage_Report.pdf');
}
