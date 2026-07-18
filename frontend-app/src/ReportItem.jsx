import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authFetch } from './api';

export default function ReportItem() {
  const navigate = useNavigate();
  const location = useLocation();

  // Safe logic: Agar state available hai toh type lo, warna 'lost' set karo
  const [reportType, setReportType] = useState(
    (location.state && location.state.type) ? location.state.type.toLowerCase() : 'lost'
  );

  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState({
    description: '',
    city: '',
    date: ''
  });
  
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);
  const [submitStatus, setSubmitStatus] = useState('idle');

  const categories = [
    { id: 'CNIC', icon: 'badge' },
    { id: 'Wallet', icon: 'account_balance_wallet' },
    { id: 'Phone', icon: 'smartphone' },
    { id: 'Pet', icon: 'pets' },
    { id: 'Other', icon: 'more_horiz' }
  ];

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const calculateProgress = () => {
    let score = 0;
    if (selectedCategory) score += 20; 
    if (formData.description.length > 10) score += 25; 
    if (formData.city) score += 15; 
    if (formData.date) score += 15; 
    if (file || reportType === 'lost') score += 25; 
    return score;
  };

  const processFile = (selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setErrorMsg('');
    } else {
      setErrorMsg('Please upload a valid image file (JPG, PNG).');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => { setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) processFile(e.dataTransfer.files[0]);
  };

  const removePhoto = (e) => {
    e.stopPropagation();
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!selectedCategory) {
      setErrorMsg('Please select a category first.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (reportType === 'found' && !file) {
      setErrorMsg('Visual evidence (Photo) is required for Found items.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSubmitStatus('submitting');

    try {
      // Build the payload matching the backend PostCreate schema
      const payload = {
        type: reportType,           // "lost" | "found"
        category: selectedCategory, // "CNIC" | "Wallet" | "Phone" | "Pet" | "Other"
        description: formData.description,
        city: formData.city,
        date: formData.date,        // ISO date string "YYYY-MM-DD"
      };

      await authFetch('/posts/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setSubmitStatus('success');

      // Redirect to dashboard after a brief success flash
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setSubmitStatus('idle');
      if (err.status === 401) {
        navigate('/login', { state: { from: { pathname: '/report' } } });
        return;
      }
      setErrorMsg(err.message || 'Failed to submit report. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

  };

  const themeColor = reportType === 'found' ? '#10B981' : '#F59E0B';
  const themeBgHover = reportType === 'found' ? 'hover:bg-[#059669]' : 'hover:brightness-110';


  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-sans">
      
      <header className="bg-surface/95 backdrop-blur-md docked full-width top-0 border-b border-outline-variant z-40 sticky">
        <div className="flex justify-between items-center w-full px-4 sm:px-8 max-w-container-max mx-auto h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-white text-xl">account_balance</span>
            </div>
            <span className="text-xl font-bold text-primary">LostFoundPK</span>
          </Link>
          <nav className="hidden md:flex gap-8">
            <Link to="/" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Home</Link>
            <Link to="/browse" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Browse</Link>
            {/* Nav link ko sahi /report route de diya */}
            <Link to="/report" className="text-sm font-medium text-primary border-b-2 border-primary pb-1">Report</Link>
            <Link to="/about" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">About</Link>
          </nav>
          <Link to="/dashboard" className="material-symbols-outlined text-on-surface-variant p-2" aria-label="Account">account_circle</Link>
        </div>
      </header>

      <main className="flex-grow w-full max-w-3xl mx-auto px-4 sm:px-6 py-10">
        
        <div className="mb-8 flex justify-center">
          <div className="flex bg-surface-container-low p-1.5 rounded-2xl border border-outline-variant shadow-sm inline-flex">
            <button
              onClick={() => { setReportType('lost'); setErrorMsg(''); }}
              className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${
                reportType === 'lost' ? 'bg-white text-[#F59E0B] shadow-md' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Report Lost Item
            </button>
            <button
              onClick={() => { setReportType('found'); setErrorMsg(''); }}
              className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${
                reportType === 'found' ? 'bg-white text-[#10B981] shadow-md' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Report Found Item
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-4xl font-bold text-primary mb-2">
            Report a {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Item
          </h2>
          <p className="text-base text-on-surface-variant">
            {reportType === 'found'
              ? 'Help reunite someone with their belongings by providing accurate details.'
              : 'Your detailed report helps our community match found items more accurately. Please provide as much detail as possible.'}
          </p>
        </div>

        <div className="w-full bg-surface-container-high h-1.5 rounded-full mb-8 overflow-hidden">
          <div 
            className="h-full transition-all duration-500 ease-in-out" 
            style={{ width: `${calculateProgress()}%`, backgroundColor: themeColor }}
          ></div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-[#ffdad6] text-[#93000a] rounded-xl flex items-center gap-3 font-medium animate-pulse">
            <span className="material-symbols-outlined">error</span>
            {errorMsg}
          </div>
        )}

        <form className="space-y-8" onSubmit={handleSubmit}>
          
          <section className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm">
            <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-4">Step 1: Select Category</h3>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => { setSelectedCategory(cat.id); setErrorMsg(''); }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all duration-200 active:scale-95 ${
                    selectedCategory === cat.id
                      ? 'text-white border-transparent shadow-md'
                      : 'border-outline-variant hover:bg-surface-container-low text-on-surface'
                  }`}
                  style={{ backgroundColor: selectedCategory === cat.id ? themeColor : 'transparent' }}
                >
                  <span className="material-symbols-outlined">{cat.icon}</span>
                  <span className="text-sm font-medium">{cat.id}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm">
            <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-4">Step 2: Item Details</h3>
            <div className="space-y-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-on-surface">Detailed Description <span className="text-[#93000a]">*</span></label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full rounded-xl border border-outline-variant p-4 text-base outline-none transition-all resize-none focus:ring-1"
                  style={{ '--tw-ring-color': themeColor, borderColor: formData.description ? themeColor : '' }}
                  placeholder={reportType === 'Lost' 
                    ? "e.g., Black leather wallet with a 'Levis' logo on the front..." 
                    : "Describe the found item..."}
                  rows="4"
                ></textarea>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-on-surface">City <span className="text-[#93000a]">*</span></label>
                  <select
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full bg-white border border-outline-variant rounded-xl h-[52px] px-4 text-base outline-none transition-all focus:ring-1"
                    style={{ '--tw-ring-color': themeColor }}
                  >
                    <option disabled value="">Select City</option>
                    <option>Karachi</option>
                    <option>Lahore</option>
                    <option>Islamabad</option>
                    <option>Peshawar</option>
                    <option>Quetta</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-on-surface">
                    Date {reportType} <span className="text-[#93000a]">*</span>
                  </label>
                  <input
                    required
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-white border border-outline-variant rounded-xl h-[52px] px-4 text-base outline-none transition-all focus:ring-1"
                    style={{ '--tw-ring-color': themeColor }}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm">
            <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-4">
              Step 3: Visual Evidence {reportType === 'lost' && <span className="text-outline text-xs normal-case ml-2">(Optional)</span>}
            </h3>
            
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !previewUrl && fileInputRef.current.click()}
              className={`relative border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer group min-h-[200px] ${
                previewUrl 
                  ? 'border-transparent p-0 overflow-hidden shadow-sm' 
                  : isDragging 
                    ? 'border-primary bg-primary/5 scale-[1.01]' 
                    : 'border-outline-variant bg-surface-container-low hover:bg-surface-container'
              }`}
            >
              {previewUrl ? (
                <div className="relative w-full h-full group">
                  <img src={previewUrl} alt="Preview" className="w-full h-48 object-contain bg-black/5" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button"
                      onClick={removePhoto}
                      className="bg-white/20 backdrop-blur-md text-white border border-white/50 px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-white/30 transition-colors"
                    >
                      <span className="material-symbols-outlined">delete</span> Change Photo
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <span className="material-symbols-outlined text-outline group-hover:text-primary text-5xl mb-4 transition-colors">cloud_upload</span>
                  <p className="text-base font-medium text-on-surface text-center">Drag and drop a photo or <span className="text-primary underline">browse</span></p>
                  <p className="text-xs text-on-surface-variant mt-2">Supports JPG, PNG (Max 5MB)</p>
                </>
              )}
              <input type="file" accept="image/jpeg, image/png" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            </div>
          </section>

          <div className="pt-4">
            <button
              type="submit"
              disabled={submitStatus !== 'idle'}
              className={`w-full text-white font-bold h-14 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 ${themeBgHover}`}
              style={{ backgroundColor: submitStatus === 'success' ? '#003a26' : themeColor }}
            >
              {submitStatus === 'idle' && (
                <>
                  <span className="material-symbols-outlined">{reportType === 'Found' ? 'check_circle' : 'send'}</span>
                  Post Report
                </>
              )}
              {submitStatus === 'submitting' && (
                <>
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  Processing...
                </>
              )}
              {submitStatus === 'success' && (
                <>
                  <span className="material-symbols-outlined">done_all</span>
                  Report Published!
                </>
              )}
            </button>
            <p className="text-center text-xs text-on-surface-variant mt-4">
              By posting, you agree to our <Link to="#" className="underline">Safety Guidelines</Link>.
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}