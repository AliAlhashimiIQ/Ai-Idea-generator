import './App.css';
import { Typewriter } from 'react-simple-typewriter';
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { supabase } from './supabaseClient';
import { FaBrain, FaLightbulb, FaPenNib, FaEnvelope, FaGlobe, FaUserAstronaut, FaMagic, FaCheckCircle, FaStar, FaRocket, FaPalette, FaUserCircle, FaUserEdit, FaUserTie, FaRobot, FaComments } from 'react-icons/fa';

const SKILLS = ['Design', 'Coding', 'Marketing', 'Writing', 'Business', 'AI', 'Data', 'Product'];
const GOALS = ['Build a startup', 'Freelance', 'Side project', 'Learn', 'Grow audience'];
const INDUSTRIES = ['Tech', 'Health', 'Education', 'Finance', 'E-commerce', 'Media', 'Travel', 'Other'];
const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

function LandingPage() {
  const [showModal, setShowModal] = useState(false);
  const [skills, setSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState('');
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [goal, setGoal] = useState('');
  const [description, setDescription] = useState('');
  const [field, setField] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const toggleSkill = (skill) => {
    setSkills(skills.includes(skill) ? skills.filter(s => s !== skill) : [...skills, skill]);
  };
  const removeSkill = (skill) => {
    setSkills(skills.filter(s => s !== skill));
  };
  const addCustomSkill = () => {
    if (customSkill.trim() && !skills.includes(customSkill.trim())) {
      setSkills([...skills, customSkill.trim()]);
      setCustomSkill('');
      setShowSkillInput(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const { type, prompt } = getIdeaTypeAndPrompt({ skills, goal, description, numIdeas: 3, field, skillLevel });
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful idea generator.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 1200,
          temperature: 1.1
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      let ideas = [];
      try {
        let text = response.data.choices[0].message.content.trim();
        if (text.startsWith('```')) {
          text = text.replace(/```[a-z]*\n?/i, '').replace(/```$/, '').trim();
        }
        ideas = JSON.parse(text);
      } catch (e) {
        let text = response.data.choices[0].message.content;
        console.error('OpenAI raw response:', text);
        setError('Could not parse ideas from AI. Try again.');
        setLoading(false);
        return;
      }
      setLoading(false);
      setShowModal(false);
      navigate('/ideas', { state: { skills, goal, description, ideas, ideaType: type, field, skillLevel } });
    } catch (err) {
      setError('Failed to fetch ideas from OpenAI.');
      setLoading(false);
    }
  };

  return (
    <div className="dark-landing-root">
      <div className="floating-shape shape1"></div>
      <div className="floating-shape shape2"></div>
      <div className="floating-shape shape3"></div>
      <header className="dark-landing-header">
        <div className="brand-bar">
          <span className="brand-logo"><FaLightbulb size={38} /></span>
          <span className="brand-name">IdeaGen</span>
        </div>
        <h1 className="dark-landing-title">
          <Typewriter
            words={['Master your day', 'Generate your next big idea', 'AI-powered inspiration']}
            loop={0}
            cursor
            cursorStyle='|'
            typeSpeed={70}
            deleteSpeed={40}
            delaySpeed={1500}
          />
        </h1>
        <div className="dark-landing-subtitle">
          Your personal AI assistant for creative, actionable, and monetizable ideas.
        </div>
        <p className="dark-landing-desc">
          AI Idea Generator seamlessly blends into your workflow to help you create, write, brainstorm, and research.
        </p>
        <button className="dark-landing-cta" onClick={() => setShowModal(true)}>Get Started – it's free</button>
      </header>
      <div className="dark-landing-card">
        <div className="dark-landing-card-title">Create</div>
        <ul className="dark-landing-list">
          <li><span className="icon-brain"><FaBrain size={28} /></span> Saved Prompts</li>
          <li><span className="icon-lightbulb"><FaLightbulb size={28} /></span> Brainstorming</li>
          <li><span className="icon-pen"><FaPenNib size={28} /></span> Writing</li>
          <li><span className="icon-envelope"><FaEnvelope size={28} /></span> Emails</li>
          <li><span className="icon-globe"><FaGlobe size={28} /></span> Social Media</li>
        </ul>
      </div>
      <footer className="dark-landing-footer">
        <span>#1 in AI Tools</span>
      </footer>

      {/* How it Works Section */}
      <section className="how-section">
        <h2>How it Works</h2>
        <div className="how-steps">
          <div className="how-step">
            <span className="icon-astronaut"><FaUserAstronaut size={24} /></span>
            <p>Tell us your skills & interests</p>
          </div>
          <div className="how-step">
            <span className="icon-magic"><FaMagic size={24} /></span>
            <p>AI generates tailored ideas</p>
          </div>
          <div className="how-step">
            <span className="icon-check"><FaCheckCircle size={24} /></span>
            <p>Save, expand, and start building</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose AI Idea Generator?</h2>
        <div className="features-list">
          <div className="feature-card">
            <span className="icon-brain"><FaBrain size={28} /></span>
            <h3>Personalized AI</h3>
            <p>Ideas are tailored to your unique background and goals.</p>
          </div>
          <div className="feature-card">
            <span className="icon-star"><FaStar size={28} /></span>
            <h3>Save & Organize</h3>
            <p>Bookmark, track, and manage your favorite ideas easily.</p>
          </div>
          <div className="feature-card">
            <span className="icon-rocket"><FaRocket size={28} /></span>
            <h3>Instant Inspiration</h3>
            <p>Get actionable ideas in seconds, ready to launch.</p>
          </div>
          <div className="feature-card">
            <span className="icon-palette"><FaPalette size={28} /></span>
            <h3>Modern UI</h3>
            <p>Enjoy a beautiful, soft, and distraction-free interface.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>What users say</h2>
        <div className="testimonials-list">
          <div className="testimonial-card">
            <div className="testimonial-avatar"><span className="icon-usercircle"><FaUserCircle size={32} /></span></div>
            <div className="testimonial-text">“I got my first side project idea in 2 minutes. The AI is spot on!”</div>
            <div className="testimonial-user">— Alex, Indie Hacker</div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-avatar"><span className="icon-useredit"><FaUserEdit size={32} /></span></div>
            <div className="testimonial-text">“Super easy to use and the ideas are actually actionable.”</div>
            <div className="testimonial-user">— Sam, Designer</div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-avatar"><span className="icon-usertie"><FaUserTie size={32} /></span></div>
            <div className="testimonial-text">“The best tool for brainstorming startup ideas. Love the UI!”</div>
            <div className="testimonial-user">— Jordan, Founder</div>
          </div>
        </div>
      </section>

      {showModal && (
        <div className="input-modal-overlay">
          <div className="input-modal">
            <button className="input-modal-close" onClick={() => setShowModal(false)}>×</button>
            <h2>Personalize Your Ideas</h2>
            <div className="input-group">
              <label>Field/Industry:</label>
              <select value={field} onChange={e => setField(e.target.value)}>
                <option value="">Select field</option>
                {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label>Skill Level:</label>
              <select value={skillLevel} onChange={e => setSkillLevel(e.target.value)}>
                <option value="">Select skill level</option>
                {SKILL_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label>Skills:</label>
              <div className="chip-list">
                {SKILLS.map(skill => (
                  <span
                    key={skill}
                    className={`chip${skills.includes(skill) ? ' selected' : ''}`}
                    onClick={() => toggleSkill(skill)}
                  >{skill}</span>
                ))}
                {skills.filter(s => !SKILLS.includes(s)).map(skill => (
                  <span key={skill} className="chip selected custom-chip">
                    {skill}
                    <button className="chip-remove" onClick={e => { e.stopPropagation(); removeSkill(skill); }}>&times;</button>
                  </span>
                ))}
                {showSkillInput ? (
                  <input
                    className="chip-input"
                    type="text"
                    value={customSkill}
                    autoFocus
                    onChange={e => setCustomSkill(e.target.value)}
                    onBlur={addCustomSkill}
                    onKeyDown={e => { if (e.key === 'Enter') addCustomSkill(); }}
                    placeholder="Add skill"
                  />
                ) : (
                  <span className="chip other-chip" onClick={() => setShowSkillInput(true)}>+ Other</span>
                )}
              </div>
            </div>
            <div className="input-group">
              <label>Goal:</label>
              <select value={goal} onChange={e => setGoal(e.target.value)}>
                <option value="">Select goal</option>
                {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label>Describe what you want ideas for:</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe your interests, problems, or context for the ideas..."
                rows={4}
                style={{resize:'vertical', minHeight: '60px', fontSize: '1rem', padding: '8px', borderRadius: '8px', border: '1.5px solid #a78bfa', background: '#23243a', color: '#fff'}}
              />
            </div>
            <button className="input-modal-submit" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Generating...' : 'Generate Ideas'}
            </button>
            {error && <div style={{color:'#ff6b6b', marginTop:8}}>{error}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

function IdeaGenerationPage() {
  const location = useLocation();
  const userInput = location.state || {};
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [ideas, setIdeas] = useState(userInput.ideas || []);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [allChatHistories, setAllChatHistories] = useState({});
  const [chatHistory, setChatHistory] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const ideaType = userInput.ideaType || 'startup';

  const currentIdea = ideas[currentIdx];

  // Restore chat history for current idea
  useEffect(() => {
    if (showChat && currentIdea) {
      const key = currentIdea.title || currentIdx;
      setChatHistory(allChatHistories[key] || []);
    }
    // eslint-disable-next-line
  }, [showChat, currentIdx]);

  // Save chat history when it changes
  useEffect(() => {
    if (showChat && currentIdea) {
      const key = currentIdea.title || currentIdx;
      setAllChatHistories(prev => ({ ...prev, [key]: chatHistory }));
    }
    // eslint-disable-next-line
  }, [chatHistory]);

  const handleNext = () => {
    setExpanded(null);
    setCurrentIdx((prev) => (prev + 1) % ideas.length);
  };

  const handleGenerateAnother = async () => {
    setLoading(true);
    setError('');
    try {
      const { type, prompt } = getIdeaTypeAndPrompt({ skills: userInput.skills, goal: userInput.goal, description: userInput.description, numIdeas: 1 });
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful idea generator.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 1200,
          temperature: 1.1
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      let newIdeas = [];
      try {
        let text = response.data.choices[0].message.content.trim();
        if (text.startsWith('```')) {
          text = text.replace(/```[a-z]*\n?/i, '').replace(/```$/, '').trim();
        }
        newIdeas = JSON.parse(text);
      } catch (e) {
        let text = response.data.choices[0].message.content;
        console.error('OpenAI raw response:', text);
        setError('Could not parse ideas from AI. Try again.');
        setLoading(false);
        return;
      }
      setIdeas((prev) => [...prev, ...newIdeas]);
      setCurrentIdx(ideas.length); // show the new idea
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch idea from OpenAI.');
      setLoading(false);
    }
  };

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;
    setChatLoading(true);
    const userMsg = { role: 'user', content: chatInput };
    setChatHistory((prev) => [...prev, userMsg]);
    try {
      const systemPrompt = `You are an expert assistant. The user is discussing this idea: ${JSON.stringify(currentIdea, null, 2)}. Answer their questions, give suggestions, and help them expand or implement the idea.`;
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            ...chatHistory,
            userMsg
          ],
          max_tokens: 600,
          temperature: 1.0
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      const aiMsg = { role: 'assistant', content: response.data.choices[0].message.content };
      setChatHistory((prev) => [...prev, aiMsg]);
    } catch (e) {
      setChatHistory((prev) => [...prev, { role: 'assistant', content: 'Sorry, there was an error. Please try again.' }]);
    }
    setChatInput('');
    setChatLoading(false);
  };

  function renderIdeaCard(idea) {
    if (ideaType === 'tiktok') {
      return (
        <div className="idea-card-dark status-tiktok">
          <div className="idea-card-header-dark">
            <h2 className="idea-title-glow">{idea.title}</h2>
          </div>
          <div className="idea-card-body-dark">
            <div><b>🎬 Hook:</b> {idea.hook}</div>
            <div><b>📝 Description:</b> {idea.description}</div>
            <div><b>🏷️ Hashtags:</b> {Array.isArray(idea.hashtags) ? idea.hashtags.join(' ') : idea.hashtags}</div>
          </div>
        </div>
      );
    } else if (ideaType === 'blog') {
      return (
        <div className="idea-card-dark status-blog">
          <div className="idea-card-header-dark">
            <h2 className="idea-title-glow">{idea.title}</h2>
          </div>
          <div className="idea-card-body-dark">
            <div><b>📝 Summary:</b> {idea.summary}</div>
            <div><b>🎯 Target Audience:</b> {idea.targetAudience}</div>
            <div><b>🗒️ Outline:</b> <ol>{idea.outline && idea.outline.map((s, i) => <li key={i}>{s}</li>)}</ol></div>
          </div>
        </div>
      );
    } else {
      // Default: startup
      return (
        <div className={`idea-card-dark status-${idea.status ? idea.status.replace(/ /g, '').toLowerCase() : ''}`}>
          <div className="idea-card-header-dark">
            <h2 className="idea-title-glow">{idea.title}</h2>
            <span className={`idea-status-dark ${idea.status ? idea.status.toLowerCase() : ''}`}>{idea.status}</span>
          </div>
          <div className="idea-card-body-dark">
            <div><b>❓ Problem:</b> {idea.problem}</div>
            <div><b>🎯 Audience:</b> {idea.audience}</div>
            <div><b>💰 Monetization:</b> {idea.monetization}</div>
            <div><b>🧱 Tech Stack:</b> {idea.techStack}</div>
            <div><b>🚀 Steps:</b> <ol>{idea.steps && idea.steps.map((s, i) => <li key={i}>{s}</li>)}</ol></div>
            <div style={{marginTop:12}}><b>💬 Discussion:</b> {idea.discussion}</div>
          </div>
          <div className="idea-card-actions-dark">
            <button className="ideas-btn" onClick={() => { setShowChat(true); setChatHistory([]); }}>Discuss with AI</button>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="ideas-root-dark">
      <header className="ideas-header-dark">
        <h1 className="ideas-title-glow">AI-Generated Idea</h1>
        <div className="ideas-controls-dark">
          <button className="ideas-btn" onClick={handleNext} disabled={ideas.length <= 1}>Next Idea</button>
          <button className="ideas-btn" onClick={handleGenerateAnother} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Another Idea'}
          </button>
        </div>
      </header>
      <div className="ideas-list-dark">
        {currentIdea ? (
          renderIdeaCard(currentIdea)
        ) : (
          <div style={{color:'#a7c7e7', textAlign:'center', marginTop:40}}>No ideas found. Try generating one.</div>
        )}
        {error && <div style={{color:'#ff6b6b', marginTop:16}}>{error}</div>}
      </div>
      {showChat && !minimized && (
        <div className="ai-chat-fullscreen-modal" style={{position:'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(24,26,32,0.97)', zIndex:3000, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div className="ai-chat-modal-content" style={{width:'100%', maxWidth:700, height:'90vh', background:'#23243a', borderRadius:24, boxShadow:'0 8px 40px 0 rgba(110,142,251,0.22)', display:'flex', flexDirection:'column', padding:'0 0 18px 0', position:'relative'}}>
            <button className="close-expand-dark" onClick={() => setShowChat(false)} style={{top:24, right:32, position:'absolute', fontSize:'2rem', color:'#a78bfa', background:'none', border:'none', zIndex:10}}>×</button>
            <button className="close-expand-dark" onClick={() => setMinimized(true)} style={{top:24, right:80, position:'absolute', fontSize:'1.7rem', color:'#a7c7e7', background:'none', border:'none', zIndex:10}} title="Minimize"><FaComments /></button>
            <div style={{padding:'32px 36px 0 36px', borderBottom:'1.5px solid #a78bfa', display:'flex', alignItems:'center', gap:14}}>
              <span style={{fontSize:'2rem', color:'#a78bfa'}}>💬</span>
              <h2 style={{margin:0, fontSize:'1.5rem', color:'#a7c7e7', fontWeight:700}}>Discuss with AI</h2>
            </div>
            <div style={{display:'flex', flexDirection:'column', flex:1, overflow:'hidden', padding:'0 36px'}}>
              <div style={{margin:'24px 0 18px 0', background:'#181a20', borderRadius:16, padding:'20px 24px', color:'#fff', boxShadow:'0 1px 8px #a78bfa11'}}>
                <div style={{fontWeight:'bold', fontSize:'1.18rem', color:'#a78bfa', marginBottom:6}}>{currentIdea.title}</div>
                <div style={{marginBottom:6}}><b>❓ Problem:</b> {currentIdea.problem}</div>
                <div style={{marginBottom:6}}><b>🎯 Audience:</b> {currentIdea.audience}</div>
                <div style={{marginBottom:6}}><b>💰 Monetization:</b> {currentIdea.monetization}</div>
                <div style={{marginBottom:6}}><b>🧱 Tech Stack:</b> {currentIdea.techStack}</div>
                <div style={{marginBottom:0}}><b>🚀 Steps:</b> <ol style={{margin:'6px 0 0 18px'}}>{currentIdea.steps && currentIdea.steps.map((s, i) => <li key={i}>{s}</li>)}</ol></div>
              </div>
              <div style={{height:2, background:'#a78bfa33', borderRadius:2, margin:'0 0 18px 0'}} />
              <div style={{flex:1, minHeight:120, overflowY:'auto', background:'#191a23', borderRadius:12, padding:'18px 16px', marginBottom:16, border:'1.5px solid #23243a', boxShadow:'0 1px 8px #a78bfa22', display:'flex', flexDirection:'column', gap:14}}>
                {chatHistory.length === 0 && <div style={{color:'#b0b8c1'}}>Ask a question about this idea!</div>}
                {chatHistory.map((msg, idx) => (
                  msg.role === 'user' ? (
                    <div key={idx} style={{alignSelf:'flex-end', background:'#6e8efb', color:'#fff', borderRadius:'18px 18px 6px 18px', padding:'12px 18px', maxWidth:'80%', fontSize:'1.05rem', boxShadow:'0 1px 6px #6e8efb33', display:'flex', alignItems:'center', gap:8}}>
                      <FaUserCircle style={{fontSize:'1.3rem', marginRight:4}} />
                      <span><b style={{fontWeight:600}}>You:</b> {msg.content}</span>
                    </div>
                  ) : (
                    <div key={idx} style={{alignSelf:'flex-start', background:'#23243a', color:'#a7c7e7', borderRadius:'18px 18px 18px 6px', padding:'12px 18px', maxWidth:'80%', fontSize:'1.05rem', boxShadow:'0 1px 6px #a78bfa33', display:'flex', alignItems:'center', gap:8}}>
                      <FaRobot style={{fontSize:'1.3rem', marginRight:4}} />
                      <span><b style={{fontWeight:600}}>AI:</b> <span dangerouslySetInnerHTML={{__html: renderMarkdown(msg.content)}} /></span>
                    </div>
                  )
                ))}
              </div>
              <div style={{display:'flex', gap:10, alignItems:'center', marginTop:'auto'}}>
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleChatSend(); }}
                  placeholder="Type your question..."
                  style={{flex:1, borderRadius:10, border:'1.5px solid #a78bfa', background:'#23243a', color:'#fff', padding:'14px', fontSize:'1.08rem'}}
                  disabled={chatLoading}
                />
                <button className="ideas-btn" onClick={handleChatSend} disabled={chatLoading || !chatInput.trim()} style={{padding:'14px 28px', fontSize:'1.08rem'}}>
                  {chatLoading ? '...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showChat && minimized && (
        <div style={{position:'fixed', bottom:32, right:32, zIndex:3100}}>
          <button onClick={() => setMinimized(false)} style={{background:'#a78bfa', color:'#23243a', border:'none', borderRadius:'50%', width:60, height:60, boxShadow:'0 2px 12px #a78bfa55', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', cursor:'pointer'}} title="Open AI Chat">
            <FaComments />
          </button>
        </div>
      )}
    </div>
  );
}

function AuthBar() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  const handleGoogleLogin = () => {
    supabase.auth.signInWithOAuth({ provider: 'google' });
  };
  const handleLogout = () => {
    supabase.auth.signOut();
  };
  return (
    <div style={{position:'absolute',top:24,right:32,zIndex:10,display:'flex',alignItems:'center',gap:12}}>
      {user ? (
        <>
          <span style={{color:'#a7c7e7', fontSize:'1rem'}}>{user.email}</span>
          <button className="ideas-btn" onClick={handleLogout}>Sign out</button>
        </>
      ) : (
        <button className="ideas-btn" onClick={handleGoogleLogin}>Sign in with Google</button>
      )}
    </div>
  );
}

// Helper to detect idea type and build prompt
function getIdeaTypeAndPrompt({ skills, goal, description, numIdeas = 3, field = '', skillLevel = '' }) {
  // Use a dynamic prompt template for all cases
  const prompt = `Suggest ${numIdeas} useful and actionable idea(s) for someone in the field of ${field || 'General'}, with ${skillLevel || 'any'} experience, who knows ${skills.length ? skills.join(", ") : 'various tools'}, and is looking to ${goal || 'achieve something new'}. The idea should be achievable with the given skill level and tools, and include real-world impact, clear steps, and optional monetization.\n\nRespond ONLY with a JSON array. Each idea should have: title, problem, audience, monetization, techStack, steps (array of 3), and a short description for each.\n\nFormat:\n[\n  {\n    "title": "...",\n    "problem": "...",\n    "audience": "...",\n    "monetization": "...",\n    "techStack": "...",\n    "steps": ["...", "...", "..."],\n    "discussion": "..." // a short paragraph inviting the user to ask follow-up questions about this idea\n  }\n]\nNo explanation, no markdown, no code block.`;
  return { type: 'dynamic', prompt };
}

// Simple markdown to HTML renderer for bold, lists, and line breaks
function renderMarkdown(text) {
  if (!text) return '';
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // bold
    .replace(/\n/g, '<br/>') // line breaks
    .replace(/\n?\d+\. (.*?)(?=\n|$)/g, '<li>$1</li>'); // numbered lists
  // Wrap <li> in <ol> if any
  if (html.includes('<li>')) html = html.replace(/(<li>.*<\/li>)/gs, '<ol>$1</ol>');
  return html;
}

export default function App() {
  return (
    <>
      <AuthBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/ideas" element={<IdeaGenerationPage />} />
      </Routes>
    </>
  );
}
