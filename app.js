// Wagdi Web Dictionary & Grammar Guide - App Logic
// Vanilla JavaScript - No build tools required

document.addEventListener('DOMContentLoaded', () => {
    // State management
    let words = [];
    let grammar = [];
    let currentTab = 'dict';
    let searchQuery = '';
    let selectedAkshar = '';

    // DOM Elements
    const tabDictBtn = document.getElementById('tab-dict-btn');
    const tabGramBtn = document.getElementById('tab-gram-btn');
    const tabDict = document.getElementById('tab-dict');
    const tabGram = document.getElementById('tab-gram');
    const searchInput = document.getElementById('search-input');
    const alphabetBar = document.getElementById('alphabet-bar');
    const wordContainer = document.getElementById('word-container');
    const grammarContainer = document.getElementById('grammar-container');

    // Sample Fallback Data (in case data.json fails)
    const fallbackData = {
        words: [
            { id: "w1", word: "वागड़ी", transliteration: "Vāgaṛī", pos: "संज्ञा", meanings: { hindi: "वागड़ क्षेत्र की भाषा", english: "Language of Vagad region" }, example: { wagdi: "वागड़ी भाषा वागड़ में बोली जावे है।", hindi: "वागड़ी भाषा वागड़ क्षेत्र में बोली जाती है।" }, tags: ["भाषा", "क्षेत्र"] },
            { id: "w2", word: "चौपाल", transliteration: "Caupāl", pos: "संज्ञा", meanings: { hindi: "गाँव की सभा या बैठक", english: "Village gathering place" }, example: { wagdi: "चौपाल पे सब मिल्या।", hindi: "चौपाल पर सब मिले।" }, tags: ["संस्कृति", "स्थान"] }
        ],
        grammar: [
            { id: "g1", category: "सर्वनाम", description: "वागड़ी में सर्वनामों का प्रयोग व्यक्ति और संख्या के अनुसार बदलता है।", rules: [{ wagdi: "मैं", hindi: "मैं", english: "I", note: "प्रथम पुरुष" }], notes: "वागड़ी में 'आम्हा' शब्द का प्रयोग 'हम' के लिए अधिक होता है।" }
        ]
    };

    // Load Data from data.json
    async function loadData() {
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            words = data.words || fallbackData.words;
            grammar = data.grammar || fallbackData.grammar;
        } catch (error) {
            console.error("Error loading data.json, using fallback:", error);
            words = fallbackData.words;
            grammar = fallbackData.grammar;
        }
        renderAlphabetBar();
        renderWords();
        renderGrammar();
    }

    // Tab Switching
    function switchTab(tab) {
        currentTab = tab;
        if (tab === 'dict') {
            tabDictBtn.classList.add('border-b-4', 'border-[#9C3D24]', 'text-[#9C3D24]');
            tabDictBtn.classList.remove('text-[#5A3825]');
            tabGramBtn.classList.remove('border-b-4', 'border-[#9C3D24]', 'text-[#9C3D24]');
            tabGramBtn.classList.add('text-[#5A3825]');
            tabDict.classList.add('active');
            tabGram.classList.remove('active');
        } else {
            tabGramBtn.classList.add('border-b-4', 'border-[#9C3D24]', 'text-[#9C3D24]');
            tabGramBtn.classList.remove('text-[#5A3825]');
            tabDictBtn.classList.remove('border-b-4', 'border-[#9C3D24]', 'text-[#9C3D24]');
            tabDictBtn.classList.add('text-[#5A3825]');
            tabGram.classList.add('active');
            tabDict.classList.remove('active');
        }
    }

    tabDictBtn.addEventListener('click', () => switchTab('dict'));
    tabGramBtn.addEventListener('click', () => switchTab('gram'));

    // Search Functionality
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderWords();
    });

    // Alphabet Bar Rendering
    function renderAlphabetBar() {
        const akshars = ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ए', 'ऐ', 'ओ', 'औ', 'क', 'ख', 'ग', 'घ', 'च', 'छ', 'ज', 'झ', 'ट', 'ठ', 'ड', 'ढ', 'त', 'थ', 'द', 'ध', 'न', 'प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श', 'ष', 'स', 'ह', 'सभी'];
        
        alphabetBar.innerHTML = '';
        akshars.forEach(akshar => {
            const btn = document.createElement('button');
            btn.className = `akshar-tablet px-3 py-1 font-heading text-lg ${selectedAkshar === akshar ? 'active' : ''}`;
            btn.textContent = akshar;
            btn.onclick = () => {
                selectedAkshar = akshar === 'सभी' ? '' : akshar;
                document.querySelectorAll('.akshar-tablet').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderWords();
            };
            alphabetBar.appendChild(btn);
        });
    }

    // Render Word Cards (Pothi Style)
    function renderWords() {
        wordContainer.innerHTML = '';
        
        const filteredWords = words.filter(w => {
            const matchesSearch = w.word.toLowerCase().includes(searchQuery) || 
                                  w.meanings.hindi.toLowerCase().includes(searchQuery) || 
                                  w.transliteration.toLowerCase().includes(searchQuery);
            const matchesAkshar = selectedAkshar === '' || w.word.startsWith(selectedAkshar);
            return matchesSearch && matchesAkshar;
        });

        if (filteredWords.length === 0) {
            wordContainer.innerHTML = '<p class="col-span-full text-center py-10 text-[#5A3825]">कोई परिणाम नहीं मिला।</p>';
            return;
        }

        filteredWords.forEach(w => {
            const card = document.createElement('div');
            card.className = 'pothi-card p-6 flex flex-col';
            
            // Tags
            const tagsHtml = w.tags.map(tag => {
                const colorClass = tag === 'भाषा' ? 'badge-haldi' : tag === 'संस्कृति' ? 'badge-gerua' : 'badge-earth';
                return `<span class="badge ${colorClass} mr-2">${tag}</span>`;
            }).join('');

            card.innerHTML = `
                <div class="flex justify-between items-start mb-3">
                    <div class="flex space-x-2">${tagsHtml}</div>
                    <span class="text-[#D97706] text-sm font-medium">${w.pos}</span>
                </div>
                <h2 class="font-heading text-3xl text-[#9C3D24] mb-2">${w.word}</h2>
                <div class="text-[#5A3825] mb-4 italic text-lg">${w.transliteration}</div>
                <div class="mb-4">
                    <p class="text-[#A84424] font-semibold mb-1">हिंदी अर्थ:</p>
                    <p class="text-[#5A3825] text-lg">${w.meanings.hindi}</p>
                    <p class="text-[#78716C] text-sm mt-1">English: ${w.meanings.english}</p>
                </div>
                <blockquote class="border-l-4 border-[#D97706] pl-4 py-2 bg-[#FAF5EB] rounded-r italic mb-4">
                    <p class="text-[#9C3D24] font-medium mb-1">वागड़ी:</p>
                    <p class="text-[#5A3825]">${w.example.wagdi}</p>
                    <p class="text-[#78716C] text-sm mt-1">हिंदी: ${w.example.hindi}</p>
                </blockquote>
                <button onclick="copyToClipboard('${w.word}')" class="copy-btn w-full py-2 rounded font-semibold flex items-center justify-center gap-2">
                    <span>📋</span> कॉपी करें
                </button>
            `;
            wordContainer.appendChild(card);
        });
    }

    // Render Grammar Guide (Accordion Style)
    function renderGrammar() {
        grammarContainer.innerHTML = '';
        
        grammar.forEach((g, index) => {
            const accordion = document.createElement('div');
            accordion.className = 'pothi-card overflow-hidden';
            
            const headerId = `header-${index}`;
            const contentId = `content-${index}`;

            accordion.innerHTML = `
                <div id="${headerId}" class="accordion-header p-4 flex justify-between items-center bg-[#FAF5EB] cursor-pointer">
                    <h3 class="font-heading text-2xl text-[#9C3D24]">${g.category}</h3>
                    <span class="text-[#D97706] font-bold text-xl">▼</span>
                </div>
                <div id="${contentId}" class="accordion-content">
                    <p class="text-[#5A3825] mb-4 font-medium">${g.description}</p>
                    
                    <table class="rustic-table">
                        <thead>
                            <tr>
                                <th>वागड़ी</th>
                                <th>हिंदी</th>
                                <th>English</th>
                                <th>नोट</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${g.rules.map(rule => `
                                <tr>
                                    <td class="font-heading text-xl text-[#9C3D24]">${rule.wagdi}</td>
                                    <td>${rule.hindi}</td>
                                    <td class="text-[#78716C]">${rule.english}</td>
                                    <td class="text-sm text-[#D97706] font-medium">${rule.note}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    ${g.notes ? `
                        <div class="scroll-note mt-6">
                            <h4 class="font-heading text-xl text-[#9C3D24] mb-2">सुझाव / विशेष</h4>
                            <p class="text-[#5A3825]">${g.notes}</p>
                        </div>
                    ` : ''}
                </div>
            `;

            // Accordion Toggle Logic
            const header = accordion.querySelector(`#${headerId}`);
            const content = accordion.querySelector(`#${contentId}`);
            
            header.addEventListener('click', () => {
                const isOpen = content.classList.contains('active');
                document.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('active'));
                document.querySelectorAll('.accordion-header span').forEach(s => s.textContent = '▼');
                
                if (!isOpen) {
                    content.classList.add('active');
                    header.querySelector('span').textContent = '▲';
                }
            });

            grammarContainer.appendChild(accordion);
        });
    }

    // Copy to Clipboard Utility
    window.copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert(`"${text}" कॉपी किया गया!`);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    // Initialize
    loadData();
});