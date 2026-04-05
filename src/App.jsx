import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';

// Data tools
import JsonToCsv from './pages/tools/JsonToCsv';
import CsvToJson from './pages/tools/CsvToJson';
import ExcelToCsv from './pages/tools/ExcelToCsv';
import CsvToExcel from './pages/tools/CsvToExcel';
import XmlToJson from './pages/tools/XmlToJson';
import JsonFormatter from './pages/tools/JsonFormatter';
import YamlToJson from './pages/tools/YamlToJson';
import SqlBeautifier from './pages/tools/SqlBeautifier';
import HtmlMinifier from './pages/tools/HtmlMinifier';
import CodeFormatter from './pages/tools/CodeFormatter';
import JsonDiff from './pages/tools/JsonDiff';
import MarkdownToHtml from './pages/tools/MarkdownToHtml';
import JwtDecoder from './pages/tools/JwtDecoder';
// File tools
import TextToPdf from './pages/tools/TextToPdf';
import HtmlToPdf from './pages/tools/HtmlToPdf';
import PdfWatermark from './pages/tools/PdfWatermark';
import PdfSplitter from './pages/tools/PdfSplitter';
import PdfMerger from './pages/tools/PdfMerger';
// Image tools
import ImageCompressor from './pages/tools/ImageCompressor';
import ImageResizer from './pages/tools/ImageResizer';
import ImageConverter from './pages/tools/ImageConverter';
import FaviconGenerator from './pages/tools/FaviconGenerator';
import QrGenerator from './pages/tools/QrGenerator';
import BarcodeGenerator from './pages/tools/BarcodeGenerator';
import ColorPicker from './pages/tools/ColorPicker';
import GradientGenerator from './pages/tools/GradientGenerator';
import ImageCropper from './pages/tools/ImageCropper';
import ExifReader from './pages/tools/ExifReader';
// Audio/Video tools
import ScreenRecorder from './pages/tools/ScreenRecorder';
import VoiceRecorder from './pages/tools/VoiceRecorder';
import Mp4ToMp3 from './pages/tools/Mp4ToMp3';
import VideoCompressor from './pages/tools/VideoCompressor';
import AudioCompressor from './pages/tools/AudioCompressor';
import AudioConverter from './pages/tools/AudioConverter';
import VideoToGif from './pages/tools/VideoToGif';
import MetadataReader from './pages/tools/MetadataReader';
// Text tools
import FakeEmailGenerator from './pages/tools/FakeEmailGenerator';
import UuidGenerator from './pages/tools/UuidGenerator';
import NotesApp from './pages/tools/NotesApp';
import RegexTester from './pages/tools/RegexTester';
import LoremIpsum from './pages/tools/LoremIpsum';
import TextCounter from './pages/tools/TextCounter';
import PasswordStrength from './pages/tools/PasswordStrength';
import HashGenerator from './pages/tools/HashGenerator';
import Base64 from './pages/tools/Base64';
// Calculators
import ScientificCalculator from './pages/tools/ScientificCalculator';
import MatrixCalculator from './pages/tools/MatrixCalculator';
import UnitConverter from './pages/tools/UnitConverter';
import EmiCalculator from './pages/tools/EmiCalculator';
import GstCalculator from './pages/tools/GstCalculator';
import PercentageCalculator from './pages/tools/PercentageCalculator';
import GpaCalculator from './pages/tools/GpaCalculator';
import AgeCalculator from './pages/tools/AgeCalculator';
import RandomNumber from './pages/tools/RandomNumber';
// Business
import InvoiceGenerator from './pages/tools/InvoiceGenerator';
import SignatureGenerator from './pages/tools/SignatureGenerator';
import BusinessCard from './pages/tools/BusinessCard';
import TimeTracker from './pages/tools/TimeTracker';

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth >= 1024;
  });
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 pt-14">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <main className={`flex-1 min-w-0 p-4 md:p-6 transition-all duration-300 ${sidebarOpen ? 'lg:ml-[240px]' : 'lg:ml-0'}`}>
          {children}
          <Footer />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools/json-to-csv" element={<JsonToCsv />} />
          <Route path="/tools/csv-to-json" element={<CsvToJson />} />
          <Route path="/tools/excel-to-csv" element={<ExcelToCsv />} />
          <Route path="/tools/csv-to-excel" element={<CsvToExcel />} />
          <Route path="/tools/xml-to-json" element={<XmlToJson />} />
          <Route path="/tools/json-formatter" element={<JsonFormatter />} />
          <Route path="/tools/yaml-to-json" element={<YamlToJson />} />
          <Route path="/tools/sql-beautifier" element={<SqlBeautifier />} />
          <Route path="/tools/html-minifier" element={<HtmlMinifier />} />
          <Route path="/tools/code-formatter" element={<CodeFormatter />} />
          <Route path="/tools/json-diff" element={<JsonDiff />} />
          <Route path="/tools/markdown-to-html" element={<MarkdownToHtml />} />
          <Route path="/tools/jwt-decoder" element={<JwtDecoder />} />
          <Route path="/tools/text-to-pdf" element={<TextToPdf />} />
          <Route path="/tools/html-to-pdf" element={<HtmlToPdf />} />
          <Route path="/tools/pdf-watermark" element={<PdfWatermark />} />
          <Route path="/tools/pdf-splitter" element={<PdfSplitter />} />
          <Route path="/tools/pdf-merger" element={<PdfMerger />} />
          <Route path="/tools/image-compressor" element={<ImageCompressor />} />
          <Route path="/tools/image-resizer" element={<ImageResizer />} />
          <Route path="/tools/image-converter" element={<ImageConverter />} />
          <Route path="/tools/favicon-generator" element={<FaviconGenerator />} />
          <Route path="/tools/qr-generator" element={<QrGenerator />} />
          <Route path="/tools/barcode-generator" element={<BarcodeGenerator />} />
          <Route path="/tools/color-picker" element={<ColorPicker />} />
          <Route path="/tools/gradient-generator" element={<GradientGenerator />} />
          <Route path="/tools/image-cropper" element={<ImageCropper />} />
          <Route path="/tools/exif-reader" element={<ExifReader />} />
          <Route path="/tools/screen-recorder" element={<ScreenRecorder />} />
          <Route path="/tools/voice-recorder" element={<VoiceRecorder />} />
          <Route path="/tools/mp4-to-mp3" element={<Mp4ToMp3 />} />
          <Route path="/tools/video-compressor" element={<VideoCompressor />} />
          <Route path="/tools/audio-compressor" element={<AudioCompressor />} />
          <Route path="/tools/audio-converter" element={<AudioConverter />} />
          <Route path="/tools/video-to-gif" element={<VideoToGif />} />
          <Route path="/tools/metadata-reader" element={<MetadataReader />} />
          <Route path="/tools/fake-email-generator" element={<FakeEmailGenerator />} />
          <Route path="/tools/uuid-generator" element={<UuidGenerator />} />
          <Route path="/tools/notes-app" element={<NotesApp />} />
          <Route path="/tools/regex-tester" element={<RegexTester />} />
          <Route path="/tools/lorem-ipsum" element={<LoremIpsum />} />
          <Route path="/tools/text-counter" element={<TextCounter />} />
          <Route path="/tools/password-strength" element={<PasswordStrength />} />
          <Route path="/tools/hash-generator" element={<HashGenerator />} />
          <Route path="/tools/base64" element={<Base64 />} />
          <Route path="/tools/scientific-calculator" element={<ScientificCalculator />} />
          <Route path="/tools/matrix-calculator" element={<MatrixCalculator />} />
          <Route path="/tools/unit-converter" element={<UnitConverter />} />
          <Route path="/tools/emi-calculator" element={<EmiCalculator />} />
          <Route path="/tools/gst-calculator" element={<GstCalculator />} />
          <Route path="/tools/percentage-calculator" element={<PercentageCalculator />} />
          <Route path="/tools/gpa-calculator" element={<GpaCalculator />} />
          <Route path="/tools/age-calculator" element={<AgeCalculator />} />
          <Route path="/tools/random-number" element={<RandomNumber />} />
          <Route path="/tools/invoice-generator" element={<InvoiceGenerator />} />
          <Route path="/tools/signature-generator" element={<SignatureGenerator />} />
          <Route path="/tools/business-card" element={<BusinessCard />} />
          <Route path="/tools/time-tracker" element={<TimeTracker />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
