import React, { useState, useEffect, useRef } from "react";
import emailjs from "emailjs-com";

const TypeWriter = () => {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const messages = [
    "Journalism is Free Speech",
    "Journalism is Truth",
    "Journalism is Unfiltered",
    "Journalism is Storytelling",
    "Journalism is Powerful"
  ];
  const typingSpeed = 150;
  const deletingSpeed = 100;
  const pauseTime = 2000;

  useEffect(() => {
    const handleTyping = () => {
      const currentIndex = loopNum % messages.length;
      const fullText = messages[currentIndex];

      setText(prev => {
        if (isDeleting) {
          if (prev.length > 14) {
            return prev.substring(0, prev.length - 1);
          }
          return prev;
        }
        return fullText.substring(0, prev.length + 1);
      });

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && text.length === 14) {
        setIsDeleting(false);
        setLoopNum(prev => prev + 1);
      }
    };

    const timer = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum]);

  return (
    <span className="inline-block min-h-[1.5em] text-orange-800">
      {text}
      <span className="animate-blink">|</span>
    </span>
  );
};

const CustomVideoPlayer = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.25);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 0.25;
    }
  }, []);

  useEffect(() => {
    // Add a timeout to hide loading state if video takes too long
    const timeoutId = setTimeout(() => {
      setIsVideoLoading(false);
    }, 2000); // 2 seconds timeout

    return () => clearTimeout(timeoutId);
  }, []);

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (videoRef.current.muted) {
      videoRef.current.muted = false;
      videoRef.current.volume = 0.25;
      setVolume(0.25);
    } else {
      videoRef.current.muted = true;
    }
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    if (newVolume === 0) {
      videoRef.current.muted = true;
      setIsMuted(true);
    } else if (isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
    }
  };

  const handleProgress = () => {
    const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(progress);
  };

  const handleProgressBarClick = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    if (videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = clickPosition * videoRef.current.duration;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current.parentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="relative w-full aspect-video bg-orange-950/90 rounded-xl overflow-hidden group">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        onTimeUpdate={handleProgress}
        onClick={togglePlay}
        onPlay={() => {
          setIsPlaying(true);
          setIsVideoLoading(false);
        }}
        onLoadedData={() => setIsVideoLoading(false)}
        onPlaying={() => setIsVideoLoading(false)}
        onCanPlay={() => setIsVideoLoading(false)}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={import.meta.env.BASE_URL + 'journavideo2.mov'} type="video/quicktime" />
        <source src={import.meta.env.BASE_URL + 'journavideo2.mov'} type="video/mp4" />
      </video>

      {isVideoLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-orange-950/90 pointer-events-none">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-400"></div>
        </div>
      )}

      {/* Custom Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
        {/* Progress Bar */}
        <div
          className="w-full h-1 bg-orange-400/30 cursor-pointer rounded-full mb-4"
          onClick={handleProgressBarClick}
        >
          <div
            className="h-full bg-orange-500 rounded-full transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="text-white hover:text-orange-400 transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Volume Controls */}
            <div className="relative flex items-center group">
              <button
                onClick={toggleMute}
                onMouseEnter={() => setShowVolumeSlider(true)}
                className="text-white hover:text-orange-400 transition-colors"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34a.996.996 0 101.41-1.41L5.05 3.63a.996.996 0 00-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v1.79l2.48 2.48c.01-.08.02-.16.02-.24z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>

              {/* Volume Slider */}
              <div
                className={`absolute left-0 -top-14 bg-orange-950/90 p-2 rounded-lg transition-all duration-200 ${showVolumeSlider ? 'opacity-100 visible' : 'opacity-0 invisible'
                  }`}
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-1 appearance-none bg-orange-400/30 rounded-full outline-none
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-3
                    [&::-webkit-slider-thumb]:h-3
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-orange-400
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-moz-range-thumb]:appearance-none
                    [&::-moz-range-thumb]:w-3
                    [&::-moz-range-thumb]:h-3
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:bg-orange-400
                    [&::-moz-range-thumb]:cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="text-white hover:text-orange-400 transition-colors"
            aria-label="Toggle fullscreen"
          >
            {isFullscreen ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Add this new component for custom form input
const FormInput = ({ type, name, placeholder, value, onChange, required }) => {
  const [showError, setShowError] = useState(false);

  return (
    <div className="relative w-full">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        onInvalid={(e) => {
          e.preventDefault();
          setShowError(true);
        }}
        onInput={() => setShowError(false)}
        className="w-full px-4 py-3 rounded-md text-black bg-white border border-gray-300 
          focus:border-orange-500 focus:ring focus:ring-orange-500 outline-none transition"
      />
      {showError && (
        <div className="absolute -bottom-6 left-0 text-sm text-orange-400 bg-orange-950/95 px-3 py-1 rounded-md 
          shadow-lg backdrop-blur-sm border border-orange-500/20 animate-fadeIn">
          Please fill out this field
        </div>
      )}
    </div>
  );
};

// Add this new component for custom textarea
const FormTextArea = ({ name, placeholder, value, onChange, required }) => {
  const [showError, setShowError] = useState(false);

  return (
    <div className="relative w-full">
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        onInvalid={(e) => {
          e.preventDefault();
          setShowError(true);
        }}
        onInput={() => setShowError(false)}
        rows="4"
        className="w-full px-4 py-3 rounded-md text-black bg-white border border-gray-300 
          focus:border-orange-500 focus:ring focus:ring-orange-500 outline-none transition"
      />
      {showError && (
        <div className="absolute -bottom-6 left-0 text-sm text-orange-400 bg-orange-950/95 px-3 py-1 rounded-md 
          shadow-lg backdrop-blur-sm border border-orange-500/20 animate-fadeIn">
          Please fill out this field
        </div>
      )}
    </div>
  );
};

const TypeformContact = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    field: "",
    type: ""
  });
  const [progress, setProgress] = useState(25);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");
  const inputRef = useRef(null);

  const questions = [
    {
      id: "name",
      question: "What's your name?",
      placeholder: "Type your name here...",
      type: "text"
    },
    {
      id: "email",
      question: "What's your email address?",
      placeholder: "name@example.com",
      type: "email"
    },
    {
      id: "field",
      question: "What field of journalism interests you or what do you think journalism is lacking?",
      placeholder: "Share your thoughts here...",
      type: "textarea"
    },
    {
      id: "type",
      question: "What type of journalist are you?",
      placeholder: "E.g., Investigative, Sports, Political, Student, Aspiring...",
      type: "text"
    }
  ];

  useEffect(() => {
    // Focus the input when question changes
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Update progress
    setProgress((currentQuestion + 1) * 25);

    // Clear validation error when moving to a new question
    setValidationError("");
  }, [currentQuestion]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [questions[currentQuestion].id]: e.target.value
    });
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError("");
    }
  };

  const validateEmail = (email) => {
    return email.includes('@') && email.includes('.');
  };

  const handleNext = () => {
    // For email field, validate format before proceeding
    if (questions[currentQuestion].id === "email" && !validateEmail(formData.email)) {
      setValidationError("Please enter a valid email address (must include @ and .)");
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Use your new Apps Script URL
      const scriptURL = "https://script.google.com/macros/s/AKfycbzIGXgGSewkCte6TBbC1995dg1hWKoOPw2oGBSMINZ_mUi_UMgU3CwKD5e6KFrNqQainQ/exec";

      // Create URL with query parameters
      const url = new URL(scriptURL);
      url.searchParams.append('name', formData.name);
      url.searchParams.append('email', formData.email);
      url.searchParams.append('field', formData.field);
      url.searchParams.append('type', formData.type);
      url.searchParams.append('timestamp', new Date().toISOString());

      console.log("Submitting form data to:", url.toString());

      // Send data to Google Apps Script using GET with parameters
      await fetch(url.toString(), {
        method: 'GET',
        mode: 'no-cors' // Important for CORS issues
      });

      console.log("Form submitted successfully");

      // Show thank you message
      setCurrentQuestion(questions.length);
    } catch (error) {
      console.error("Form submission error:", error);
      alert("There was an error submitting your form. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && formData[questions[currentQuestion].id] && questions[currentQuestion].type !== 'textarea') {
      handleNext();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gradient-to-b from-orange-900/30 to-orange-950/30 backdrop-blur-sm rounded-xl border border-orange-500/20 shadow-xl overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-orange-800/50 w-full relative">
          <div
            className="absolute top-0 left-0 h-full bg-orange-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Form content */}
        <div className="p-8 md:p-10">
          {currentQuestion < questions.length ? (
            <div className="space-y-8">
              {/* Question */}
              <div className="text-left">
                <h3 className="text-2xl font-medium text-white mb-6">
                  {questions[currentQuestion].question}
                </h3>

                {questions[currentQuestion].type === "textarea" ? (
                  <textarea
                    ref={inputRef}
                    value={formData[questions[currentQuestion].id] || ""}
                    onChange={handleInputChange}
                    placeholder={questions[currentQuestion].placeholder}
                    rows="4"
                    className="w-full px-4 py-3 rounded-lg text-white bg-black/40 
                      border border-orange-500/20 placeholder-gray-400
                      focus:border-orange-400/40 focus:ring-1 focus:ring-orange-400/20 
                      focus:outline-none transition-all duration-300
                      backdrop-blur-sm resize-none"
                  />
                ) : (
                  <input
                    ref={inputRef}
                    type={questions[currentQuestion].type}
                    value={formData[questions[currentQuestion].id] || ""}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={questions[currentQuestion].placeholder}
                    className={`w-full px-4 py-3 rounded-lg text-white bg-black/40 
                      border ${validationError ? 'border-red-500' : 'border-orange-500/20'} placeholder-gray-400
                      focus:border-orange-400/40 focus:ring-1 focus:ring-orange-400/20 
                      focus:outline-none transition-all duration-300
                      backdrop-blur-sm`}
                  />
                )}

                {/* Validation error message */}
                {validationError && (
                  <div className="mt-2 text-red-400 text-sm animate-fadeIn">
                    {validationError}
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center pt-6">
                {currentQuestion > 0 ? (
                  <button
                    onClick={handleBack}
                    className="px-4 py-2 rounded-lg border border-orange-500/20 text-orange-300 hover:bg-orange-900/20 transition-all"
                  >
                    Back
                  </button>
                ) : (
                  <div></div> // Empty div to maintain layout
                )}

                <button
                  onClick={handleNext}
                  disabled={!formData[questions[currentQuestion].id] || isSubmitting}
                  className={`px-6 py-2 rounded-lg text-white transition-all relative overflow-hidden group
                    ${formData[questions[currentQuestion].id] && !isSubmitting
                      ? "bg-orange-500/80 hover:bg-orange-500"
                      : "bg-orange-500/30 cursor-not-allowed"}`}
                >
                  <span className="relative z-10">
                    {currentQuestion === questions.length - 1
                      ? (isSubmitting ? "Sending..." : "Submit")
                      : "Next"}
                  </span>
                  {formData[questions[currentQuestion].id] && !isSubmitting && (
                    <div className="absolute inset-0 animate-glossy"></div>
                  )}
                </button>
              </div>

              {/* Page indicator */}
              <div className="text-center text-sm text-orange-300/70">
                Question {currentQuestion + 1} of {questions.length}
              </div>
            </div>
          ) : (
            <div className="py-10 text-center space-y-6">
              <div className="text-5xl mb-4">✓</div>
              <h3 className="text-2xl font-medium text-white">Thank you!</h3>
              <p className="text-orange-200">
                We've received your information and will keep you updated on Journalite.
              </p>
              <button
                onClick={() => {
                  setCurrentQuestion(0);
                  setFormData({ name: "", email: "", field: "", type: "" });
                }}
                className="mt-6 px-6 py-2 rounded-lg bg-orange-500/80 hover:bg-orange-500 text-white transition-all"
              >
                Start Over
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Additional info */}
      <div className="mt-8 text-center text-sm text-orange-300/70">
        <p>Your thoughts are valuable to us. We will never share your information with third parties.</p>
        <p className="mt-2">Press ESC or click outside the form to cancel.</p>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const [formData, setFormData] = useState({ email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [teamVisible, setTeamVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTeamVisible, setIsTeamVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const teamSection = document.getElementById("team");
      if (teamSection) {
        const teamRect = teamSection.getBoundingClientRect();
        setIsTeamVisible(teamRect.top <= 0);
      }
      setShowScrollButton(window.scrollY > window.innerHeight * 0.5);
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Add this useEffect to scroll to top on page load
  useEffect(() => {
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);

    // Remove any hash from the URL without triggering a page reload
    if (window.location.hash) {
      const scrollToTop = () => {
        window.scrollTo(0, 0);
        history.replaceState(null, document.title, window.location.pathname + window.location.search);
      };

      // Use setTimeout to ensure this happens after any browser's automatic scroll to hash
      setTimeout(scrollToTop, 0);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.message) {
      alert("Please fill in both fields before sending.");
      return;
    }

    setLoading(true);
    try {
      await emailjs.send(
        "service_49qa02a",
        "template_amh3p4g",
        {
          user_email: formData.email,
          message: formData.message,
        },
        "FvneqZOkO8mT2IbDM"
      );

      setFormData({ email: "", message: "" });
    } catch (error) {
      alert("Failed to send the message, please try again later.");
      console.error("EmailJS Error:", error);
    }
    setLoading(false);
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80, // Offset for navbar height
        behavior: "smooth",
      });
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative w-full text-white font-serif">
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-200 
        ${scrolled && !isMenuOpen ? 'backdrop-blur-sm py-2' : 'py-6'} 
        bg-transparent`}>
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            {/* Title */}
            <div className={`md:hidden flex-1 text-center text-2xl font-bold text-white transition-opacity duration-200
              ${isTeamVisible ? 'opacity-100' : 'opacity-0'}`}>
              Journa Media
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex justify-center w-full">
              <ul className="flex gap-12 text-lg">
                {[
                  { name: 'Home', id: 'home' },
                  { name: 'Mission', id: 'mission' },
                  { name: 'Team', id: 'team' },
                  { name: 'Contact', id: 'contact' }
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className="relative group"
                    >
                      <span className="text-white/90 hover:text-white transition-colors duration-200">
                        {item.name}
                      </span>
                      <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-orange-400 group-hover:w-full transition-all duration-200" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-white p-2 focus:outline-none z-50"
                aria-label="Toggle Menu"
              >
                <div className="w-6 flex flex-col gap-1.5 items-end transition-all duration-200">
                  <span className={`block h-0.5 bg-orange-400 transition-all duration-200 
                    ${isMenuOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`} />
                  <span className={`block h-0.5 bg-orange-400 transition-all duration-200 
                    ${isMenuOpen ? 'opacity-0' : 'w-4'}`} />
                  <span className={`block h-0.5 bg-orange-400 transition-all duration-200 
                    ${isMenuOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-6'}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`md:hidden fixed inset-0 w-full min-h-screen
            backdrop-blur-xl bg-gradient-to-b from-orange-950/95 to-orange-900/95
            transition-all duration-300 ease-out
            ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
            `}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999
          }}
        >
          <ul className="flex flex-col items-center justify-center h-screen gap-8 text-lg">
            {[
              { name: 'Home', id: 'home' },
              { name: 'Mission', id: 'mission' },
              { name: 'Team', id: 'team' },
              { name: 'Contact', id: 'contact' }
            ].map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    scrollToSection(item.id);
                    setIsMenuOpen(false);
                  }}
                  className="relative group text-xl px-6 py-2"
                >
                  <span className="text-white/90 hover:text-white transition-colors duration-200">
                    {item.name}
                  </span>
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-orange-400 group-hover:w-full transition-all duration-200" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Home section */}
      <section id="home" className="pt-20 min-h-screen flex flex-col items-center justify-center text-white 
        bg-gradient-to-b from-orange-500 via-orange-600 to-orange-700
        transition-colors duration-500 px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold">Journalite</h1>
        <p className="mt-2 text-lg md:text-xl">Journalism Re-engineered, Home of Journalism</p>

        <div className="mt-4 text-lg">
          <TypeWriter />
        </div>

        {/* Video Container */}
        <div className="mt-8 w-full max-w-4xl mx-auto shadow-2xl">
          <CustomVideoPlayer />
        </div>
      </section>

      {/* Mission section */}
      <section id="mission" className="min-h-screen py-20 flex flex-col items-center justify-center px-6 md:px-16 
        bg-gradient-to-b from-orange-700 via-orange-700 to-orange-800
        transition-colors duration-500 text-white text-center">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">Our Mission</h2>
            <div className="space-y-6 text-lg md:text-xl leading-relaxed">
              <p className="text-orange-200">
                At Journalite, we believe journalism should be more than just words on a screen—it should be an experience.
              </p>
              <p>
                Our mission is to elevate individual voices in journalism while rethinking how news is shared, discovered, and engaged with. While journalism exists on social media and dedicated platforms, we take it a step further by creating a space where both journalists and readers are active participants in the storytelling process.
              </p>
              <p className="text-orange-200">
                We are re-engineering not only how news is first sent and seen but also how readers interact with it—making journalism more immersive, personal, and deeply connected to the people who consume it.
              </p>
            </div>
          </div>

          {/* Features Section */}
          <div className="pt-8 border-t border-orange-600/30">
            <h3 className="text-2xl md:text-3xl font-semibold mb-8 text-orange-200">
              Experience Journalism Differently
            </h3>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="p-6 rounded-lg bg-gradient-to-br from-orange-800/50 to-orange-900/50 backdrop-blur-sm border border-orange-500/10 shadow-lg">
                <h4 className="text-xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-orange-200 to-orange-400">
                  Immersive Reading Experience
                </h4>
                <p className="text-orange-100/90">
                  Dive deep into stories with our interactive reading mode, featuring customizable layouts and seamless multimedia integration.
                </p>
              </div>
              <div className="p-6 rounded-lg bg-gradient-to-br from-orange-800/50 to-orange-900/50 backdrop-blur-sm border border-orange-500/10 shadow-lg">
                <h4 className="text-xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-orange-200 to-orange-400">
                  Personal News Feed
                </h4>
                <p className="text-orange-100/90">
                  Your personalized news experience, intelligently curated based on your interests while maintaining diverse perspectives.
                </p>
              </div>
              <div className="p-6 rounded-lg bg-gradient-to-br from-orange-800/50 to-orange-900/50 backdrop-blur-sm border border-orange-500/10 shadow-lg">
                <h4 className="text-xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-orange-200 to-orange-400">
                  Interactive Discussions
                </h4>
                <p className="text-orange-100/90">
                  Engage in meaningful conversations with journalists and fellow readers in moderated, topic-focused discussion spaces.
                </p>
              </div>
              <div className="p-6 rounded-lg bg-gradient-to-br from-orange-800/50 to-orange-900/50 backdrop-blur-sm border border-orange-500/10 shadow-lg">
                <h4 className="text-xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-orange-200 to-orange-400">
                  Story Evolution
                </h4>
                <p className="text-orange-100/90">
                  Follow stories as they develop with our timeline feature, seeing how narratives evolve and connect over time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team section */}
      <section id="team" className="min-h-screen py-20 flex flex-col items-center justify-center px-6 md:px-16 
        bg-gradient-to-b from-orange-800 via-orange-900 to-orange-950
        transition-colors duration-500 text-white text-center">
        <h2 className="text-4xl font-bold mb-6">Meet Our Team</h2>
        <p className="text-lg mb-8">A dedicated group of journalists, developers, and visionaries shaping the future of media.</p>

        <div className="flex flex-wrap justify-center max-w-screen-lg w-full">
          {[
            { name: "Abdul-Malik Bello", role: "Co-Founder", linkedin: "https://www.linkedin.com/in/malikbello/", img: "abdul.png" },
            { name: "Abdisalam Sharif Ali", role: "Co-Founder", linkedin: "https://www.linkedin.com/in/abdisalam-ali-a35101257/", img: "abdi.png" },
            { name: "Abdullah Shittu", role: "Co-Founder", linkedin: "https://www.linkedin.com/in/abdullah-shittu/", img: "abdullah.png" },
            { name: "Hikmat Oladejo", role: "Co-Founder", linkedin: "https://www.linkedin.com/in/hikmatoladejo/", img: "hikmat.png" },
            { name: "Theodore Issac", role: "Co-Founder", linkedin: "https://www.linkedin.com/in/theodore-isaac-844103190/", img: "theo.png" }
          ].map((member, index) => (
            <div key={index}
              className={`flex flex-col items-center text-center space-y-4 mx-6 my-4 min-w-[260px] max-w-[280px]
                ${index === 4 ? "w-full flex justify-center" : ""}`}
            >
              <div className="w-[250px] h-[320px] overflow-hidden bg-gray-800 shadow-lg rounded-md">
                <img src={member.img} alt={member.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <p className="text-lg font-semibold">{member.name}</p>
              <p className="text-sm text-orange-300">{member.role}</p>
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm font-medium bg-orange-900 hover:bg-orange-950 text-white rounded-md shadow-md transition-all duration-300">LinkedIn</a>
            </div>
          ))}
        </div>
      </section>

      {/* Custom Scroll to Top Button */}
      {showScrollButton && (
        <button
          onClick={() => scrollToSection("home")}
          className="fixed md:bottom-8 md:right-8 bottom-20 right-4 p-3  
            bg-gradient-to-r from-orange-800/30 to-orange-700/30
            hover:from-orange-700/40 hover:to-orange-600/40
            border border-orange-400/20 hover:border-orange-400/30
            text-white/90 hover:text-white
            rounded-full backdrop-blur-sm
            transition-all duration-300 
            group focus:outline-none focus:ring-1 focus:ring-orange-400/20
            shadow-lg hover:shadow-orange-500/10
            z-[60]"
          aria-label="Scroll to top"
        >
          <div className="relative">
            <svg
              className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:-translate-y-1"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
            <div className="absolute inset-0 animate-glossy" />
          </div>
        </button>
      )}

      {/* Contact Section */}
      <section id="contact" className="min-h-screen flex flex-col items-center justify-center bg-orange-950 px-6 md:px-10 text-center">
        <h2 className="text-4xl font-bold">Contact Us</h2>
        <p className="mt-4 text-lg">Send us an email at <span className="text-orange-400">hq@journalite.app</span></p>

        <div className="mt-12 w-full">
          <TypeformContact />
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 bg-orange-950 text-center text-sm text-orange-300">
        &copy; {new Date().getFullYear()} Journa Media. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;