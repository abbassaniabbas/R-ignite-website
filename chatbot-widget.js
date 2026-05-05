(function () {
  var pathname = window.location.pathname || '';

  if (/\/(?:admin|auth)\.html$/i.test(pathname)) {
    return;
  }

  var pageId = pathname.split('/').pop() || 'index.html';
  var isNestedPage = pathname.indexOf('/my-backend/') !== -1;
  var contactLink = isNestedPage ? 'contact.html' : 'my-backend/contact.html';
  var websiteLink = 'https://www.rignitegroup.com';

  var quickReplyMap = {
    'index.html': [
      'What services do you offer?',
      'Who do you work with?',
      'Where are you based?',
      'How do we get started?'
    ],
    'about.html': [
      'What does R-Ignite do?',
      'Which sectors do you serve?',
      'What makes you different?',
      'How do we get started?'
    ],
    'services.html': [
      'Break down your services',
      'Do you offer BI dashboards?',
      'Do you implement ERP and CRM?',
      'Do you offer managed retainers?'
    ],
    'goals.html': [
      'What is your 6-year plan?',
      'What happens in stage 1?',
      'What happens in stage 2?',
      'What happens in stage 3?'
    ],
    'strategy.html': [
      'What is your strategy?',
      'Who do you work with?',
      'How do you grow?',
      'How do we get started?'
    ],
    'milestones.html': [
      'What milestones are you targeting?',
      'What is your roadmap?',
      'How do you work with clients?',
      'How do we get started?'
    ],
    'team.html': [
      'Who leads R-Ignite?',
      'How do I contact the team?',
      'Where are you based?',
      'What services do you offer?'
    ],
    'contact.html': [
      'How fast do you respond?',
      'Where are you located?',
      'What services do you offer?',
      'Do you work with banks or government?'
    ]
  };

  var greetingMap = {
    'services.html': 'Ask me about dashboards, automation, ERP or CRM delivery, custom software, or managed retainers.',
    'goals.html': 'I can explain the three-stage roadmap, revenue goals, and long-term direction.',
    'strategy.html': 'Ask about positioning, growth strategy, or the enterprise sectors R-Ignite targets.',
    'milestones.html': 'I can help summarize the roadmap, timing, and business milestones.',
    'team.html': 'Ask about the founders, leadership, or the best way to reach the team.',
    'contact.html': 'If you have a quick question before filling the form, I can help here first.'
  };

  var widget = document.createElement('section');
  widget.className = 'ri-chatbot';
  widget.setAttribute('aria-label', 'R-Ignite AI assistant');
  widget.innerHTML = [
    '<div class="ri-chatbot-pill">Questions before support?</div>',
    '<div class="ri-chatbot-panel" id="ri-chatbot-panel" role="dialog" aria-modal="false" aria-hidden="true">',
      '<div class="ri-chatbot-head">',
        '<div>',
          '<div class="ri-chatbot-eyebrow">R-Ignite AI Guide</div>',
          '<h2>Ask about services, sectors, or next steps.</h2>',
        '</div>',
        '<button type="button" class="ri-chatbot-close" aria-label="Close assistant">×</button>',
      '</div>',
      '<div class="ri-chatbot-log" aria-live="polite"></div>',
      '<div class="ri-chatbot-replies" aria-label="Suggested questions"></div>',
      '<div class="ri-chatbot-actions">',
        '<a class="ri-chatbot-human" href="' + contactLink + '">Talk to the team</a>',
      '</div>',
      '<form class="ri-chatbot-form">',
        '<label class="ri-chatbot-label" for="riChatbotInput">Ask a question</label>',
        '<div class="ri-chatbot-input-row">',
          '<input id="riChatbotInput" class="ri-chatbot-input" type="text" autocomplete="off" placeholder="Ask about services, pricing, location..." />',
          '<button type="submit" class="ri-chatbot-send">Send</button>',
        '</div>',
      '</form>',
    '</div>',
    '<button type="button" class="ri-chatbot-launcher" aria-expanded="false" aria-controls="ri-chatbot-panel">',
      '<span class="ri-chatbot-launcher-dot"></span>',
      '<span>Ask AI</span>',
    '</button>'
  ].join('');

  document.body.appendChild(widget);

  var panel = widget.querySelector('.ri-chatbot-panel');
  var launcher = widget.querySelector('.ri-chatbot-launcher');
  var closeButton = widget.querySelector('.ri-chatbot-close');
  var log = widget.querySelector('.ri-chatbot-log');
  var quickReplies = widget.querySelector('.ri-chatbot-replies');
  var form = widget.querySelector('.ri-chatbot-form');
  var input = widget.querySelector('.ri-chatbot-input');

  var intents = [
    {
      id: 'greeting',
      phrases: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
      keywords: ['hello', 'hi', 'hey'],
      answer: function () {
        return {
          html: 'Hello. I am R-Ignite&apos;s site guide, and I answer using the information on this website. ' + escapeHtml(getGreeting()),
          replies: getQuickReplies()
        };
      }
    },
    {
      id: 'about',
      phrases: ['what is r ignite', 'what is r-ignite', 'who are you', 'what do you do', 'about r ignite', 'about r-ignite'],
      keywords: ['about', 'company', 'consultancy', 'consulting'],
      answer: function () {
        return {
          html: 'R-Ignite Group is a premium Data, AI and Digital Transformation company serving Nigerian mid-to-large organisations. The firm focuses on mission-critical enterprise solutions, operates from Abuja, and works across major sectors such as banks, government, telecoms, oil and gas, and large SMEs.',
          replies: ['What services do you offer?', 'Which sectors do you serve?', 'How do we get started?']
        };
      }
    },
    {
      id: 'services',
      phrases: ['what services do you offer', 'services', 'what do you offer', 'what can you help with'],
      keywords: ['services', 'offer', 'solutions', 'help'],
      answer: function () {
        return {
          html: 'R-Ignite&apos;s core services are Business Intelligence and Analytics, AI-Powered Process Automation, ERP and CRM Implementation, Data Infrastructure and Engineering, Custom Enterprise Software, and Managed Services and Retainers.',
          replies: ['Do you offer BI dashboards?', 'Do you implement ERP and CRM?', 'Do you offer managed retainers?']
        };
      }
    },
    {
      id: 'bi',
      phrases: ['power bi', 'tableau', 'bi dashboards', 'business intelligence', 'analytics dashboards'],
      keywords: ['dashboard', 'analytics', 'tableau', 'power', 'kpi', 'reporting'],
      answer: function () {
        return {
          html: 'Yes. R-Ignite offers Business Intelligence and Analytics work including Power BI, Tableau, data warehouses, executive KPIs, real-time reporting, and data governance.',
          replies: ['Do you work with banks or government?', 'How do we get started?', 'What other services do you offer?']
        };
      }
    },
    {
      id: 'automation',
      phrases: ['ai automation', 'process automation', 'workflow ai', 'document processing', 'predictive analytics'],
      keywords: ['automation', 'rpa', 'ocr', 'workflow', 'predictive', 'nlp'],
      answer: function () {
        return {
          html: 'Yes. R-Ignite provides AI-powered process automation, including RPA, workflow AI, OCR and document processing, predictive analytics, and NLP applications.',
          replies: ['Do you build custom software too?', 'Do you offer managed retainers?', 'How do we get started?']
        };
      }
    },
    {
      id: 'erp',
      phrases: ['erp', 'crm', 'salesforce', 'dynamics 365', 'erp crm'],
      keywords: ['erp', 'crm', 'salesforce', 'dynamics', 'integration'],
      answer: function () {
        return {
          html: 'Yes. R-Ignite handles ERP and CRM implementation from system selection through go-live, including Salesforce, Dynamics 365, custom modules, legacy integration, and change management.',
          replies: ['Do you build custom software too?', 'What services do you offer?', 'How do we get started?']
        };
      }
    },
    {
      id: 'data',
      phrases: ['data infrastructure', 'data engineering', 'etl', 'data lakes', 'aws', 'azure', 'gcp'],
      keywords: ['data', 'etl', 'lake', 'aws', 'azure', 'gcp', 'api', 'database'],
      answer: function () {
        return {
          html: 'R-Ignite also builds enterprise data infrastructure, including AWS, Azure, GCP, ETL pipelines, data lakes, API development, and database optimisation.',
          replies: ['Do you offer BI dashboards?', 'Do you build custom software?', 'How do we get started?']
        };
      }
    },
    {
      id: 'software',
      phrases: ['custom software', 'bespoke software', 'enterprise software', 'admin portals', 'compliance systems'],
      keywords: ['software', 'portal', 'app', 'application', 'compliance', 'mobile'],
      answer: function () {
        return {
          html: 'Yes. R-Ignite builds bespoke enterprise applications such as admin portals, compliance systems, mobile enterprise tools, and workflow management software tailored to each organisation.',
          replies: ['Do you offer managed retainers?', 'What sectors do you serve?', 'How do we get started?']
        };
      }
    },
    {
      id: 'retainers',
      phrases: ['managed services', 'retainers', 'annual contracts', 'priority support', 'continuous improvement'],
      keywords: ['retainer', 'managed', 'monitoring', 'support', 'contract'],
      answer: function () {
        return {
          html: 'Yes. Managed Services and Retainers are part of the offer. That includes annual contracts, managed analytics, AI monitoring, priority support, and continuous improvement.',
          replies: ['How fast do you respond?', 'How do we get started?', 'What services do you offer?']
        };
      }
    },
    {
      id: 'sectors',
      phrases: ['who do you work with', 'which sectors do you serve', 'industries', 'sectors'],
      keywords: ['banks', 'government', 'telecoms', 'insurance', 'retail', 'healthcare', 'smes', 'industries'],
      answer: function () {
        return {
          html: 'R-Ignite serves banks, government agencies, telecoms, oil and gas companies, large SMEs, insurance firms, large retail groups, and healthcare organisations.',
          replies: ['What services do you offer?', 'Where are you based?', 'How do we get started?']
        };
      }
    },
    {
      id: 'pricing',
      phrases: ['how much', 'price', 'pricing', 'cost', 'quote', 'budget'],
      keywords: ['price', 'pricing', 'cost', 'quote', 'budget'],
      answer: function () {
        return {
          html: 'The site does not list fixed prices. R-Ignite positions itself as a premium consultancy, so pricing will depend on your goals, scope, integrations, and support needs. The best next step for a tailored quote is the <a href="' + contactLink + '">Get in Touch page</a>.',
          replies: ['How do we get started?', 'What services do you offer?', 'How fast do you respond?']
        };
      }
    },
    {
      id: 'contact',
      phrases: ['contact', 'talk to support', 'speak to someone', 'email', 'phone', 'call'],
      keywords: ['contact', 'support', 'email', 'phone', 'call', 'reach'],
      answer: function () {
        return {
          html: 'You can reach the team through the <a href="' + contactLink + '">Get in Touch page</a>. The public contact details on the site include abbassani@r-ignite.com, samuelurieto@r-ignite.com, and the phone numbers +234 703 057 9173 and +234 807 885 1998.',
          replies: ['How fast do you respond?', 'Where are you located?', 'Who leads R-Ignite?']
        };
      }
    },
    {
      id: 'location',
      phrases: ['where are you based', 'where are you located', 'location', 'abuja'],
      keywords: ['location', 'address', 'abuja', 'apo', 'based'],
      answer: function () {
        return {
          html: 'R-Ignite is based in Abuja. The address shown on the site is House 1, Shekinah Luxury Estate, Apo, Abuja, Nigeria.',
          replies: ['Who do you work with?', 'How fast do you respond?', 'How do we get started?']
        };
      }
    },
    {
      id: 'response',
      phrases: ['how fast do you respond', 'response time', 'when will you reply', 'how long'],
      keywords: ['response', 'reply', 'hours', 'when', 'quickly'],
      answer: function () {
        return {
          html: 'The site says the team typically replies within 24 hours, Monday to Friday, 8am to 6pm WAT.',
          replies: ['How do we get started?', 'Where are you located?', 'What services do you offer?']
        };
      }
    },
    {
      id: 'team',
      phrases: ['who leads', 'who founded', 'team', 'founders', 'leadership'],
      keywords: ['founder', 'leadership', 'team', 'ceo', 'cto'],
      answer: function () {
        return {
          html: 'R-Ignite is led by Abbas S. Abbas, Co-Founder and CEO, and Samuel E. Urieto, Co-Founder and CTO.',
          replies: ['How do I contact the team?', 'Where are you based?', 'What services do you offer?']
        };
      }
    },
    {
      id: 'roadmap',
      phrases: ['roadmap', '6 year plan', 'six year plan', 'goals', 'stage 1', 'stage 2', 'stage 3'],
      keywords: ['roadmap', 'stage', 'years', 'goals', 'plan'],
      answer: function (query) {
        if (query.indexOf('stage 1') !== -1 || query.indexOf('cash engine') !== -1) {
          return {
            html: 'Stage 1 covers years 0 to 2. The focus is building a lean premium B2B service company, targeting ₦100M to ₦250M in revenue through high-value enterprise delivery.',
            replies: ['What happens in stage 2?', 'What happens in stage 3?', 'Who do you work with?']
          };
        }

        if (query.indexOf('stage 2') !== -1 || query.indexOf('recurring revenue') !== -1) {
          return {
            html: 'Stage 2 covers years 2 to 4. The goal is converting project clients into long-term contracts and building a 60%+ recurring revenue base.',
            replies: ['What happens in stage 3?', 'Do you offer managed retainers?', 'How do we get started?']
          };
        }

        if (query.indexOf('stage 3') !== -1 || query.indexOf('productisation') !== -1 || query.indexOf('productization') !== -1) {
          return {
            html: 'Stage 3 covers years 4 to 6. The focus is productisation: turning repeated client problems into SaaS products and moving toward a hybrid service + product model.',
            replies: ['What services do you offer?', 'Who do you work with?', 'How do we get started?']
          };
        }

        return {
          html: 'R-Ignite&apos;s roadmap is a three-stage, six-year plan: Stage 1 builds the cash engine, Stage 2 grows recurring revenue, and Stage 3 focuses on productisation.',
          replies: ['What happens in stage 1?', 'What happens in stage 2?', 'What happens in stage 3?']
        };
      }
    },
    {
      id: 'website',
      phrases: ['website', 'site link', 'web address'],
      keywords: ['website', 'site', 'link'],
      answer: function () {
        return {
          html: 'The website listed on the site is <a href="' + websiteLink + '" target="_blank" rel="noopener">www.rignitegroup.com</a>.',
          replies: ['How do I contact the team?', 'Where are you based?', 'What services do you offer?']
        };
      }
    }
  ];

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      }[char];
    });
  }

  function normalize(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function getGreeting() {
    return greetingMap[pageId] || 'Ask about services, sectors, leadership, response times, location, or how to get started.';
  }

  function getQuickReplies() {
    return quickReplyMap[pageId] || quickReplyMap['index.html'];
  }

  function scrollLog() {
    log.scrollTop = log.scrollHeight;
  }

  function appendMessage(role, content, allowHtml) {
    var item = document.createElement('article');
    item.className = 'ri-chatbot-message ri-chatbot-message-' + role;

    var bubble = document.createElement('div');
    bubble.className = 'ri-chatbot-bubble';

    if (allowHtml) {
      bubble.innerHTML = content;
    } else {
      bubble.textContent = content;
    }

    item.appendChild(bubble);
    log.appendChild(item);
    scrollLog();
  }

  function setQuickReplies(replies) {
    quickReplies.innerHTML = '';

    (replies || []).slice(0, 4).forEach(function (reply) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'ri-chatbot-reply';
      button.textContent = reply;
      button.addEventListener('click', function () {
        handleQuestion(reply);
      });
      quickReplies.appendChild(button);
    });
  }

  function scoreIntent(query, intent) {
    var tokens = query.split(' ');
    var tokenMap = {};
    var score = 0;

    tokens.forEach(function (token) {
      tokenMap[token] = true;
    });

    intent.phrases.forEach(function (phrase) {
      if (query.indexOf(phrase) !== -1) {
        score += phrase.indexOf(' ') !== -1 ? 8 : 4;
      }
    });

    intent.keywords.forEach(function (keyword) {
      if (keyword.indexOf(' ') !== -1) {
        if (query.indexOf(keyword) !== -1) {
          score += 4;
        }
      } else if (tokenMap[keyword]) {
        score += 2;
      }
    });

    if (pageId === 'services.html' && /services|dashboard|automation|erp|crm|software|retainer|data/.test(query)) {
      score += 1;
    }

    if (pageId === 'contact.html' && /contact|reply|email|phone|location|support/.test(query)) {
      score += 1;
    }

    if ((pageId === 'goals.html' || pageId === 'strategy.html' || pageId === 'milestones.html') && /stage|roadmap|plan|goal|strategy/.test(query)) {
      score += 1;
    }

    return score;
  }

  function findBestAnswer(rawQuestion) {
    var normalizedQuestion = normalize(rawQuestion);
    var bestIntent = null;
    var bestScore = 0;

    intents.forEach(function (intent) {
      var score = scoreIntent(normalizedQuestion, intent);
      if (score > bestScore) {
        bestScore = score;
        bestIntent = intent;
      }
    });

    if (!bestIntent || bestScore < 2) {
      return {
        html: 'I can help with services, sectors, leadership, location, response times, pricing guidance, and how to get started. If you need a tailored answer, the <a href="' + contactLink + '">Get in Touch page</a> is the fastest way to reach the team.',
        replies: ['What services do you offer?', 'Who do you work with?', 'How do we get started?']
      };
    }

    return bestIntent.answer(normalizedQuestion);
  }

  function openWidget() {
    widget.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    launcher.setAttribute('aria-expanded', 'true');
    window.setTimeout(function () {
      input.focus();
      scrollLog();
    }, 80);
  }

  function closeWidget() {
    widget.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    launcher.setAttribute('aria-expanded', 'false');
  }

  function handleQuestion(question) {
    var cleanQuestion = String(question || '').trim();

    if (!cleanQuestion) {
      return;
    }

    appendMessage('user', cleanQuestion, false);
    input.value = '';

    var response = findBestAnswer(cleanQuestion);

    window.setTimeout(function () {
      appendMessage('bot', response.html, true);
      setQuickReplies(response.replies);
    }, 220);
  }

  launcher.addEventListener('click', function () {
    if (widget.classList.contains('is-open')) {
      closeWidget();
    } else {
      openWidget();
    }
  });

  closeButton.addEventListener('click', closeWidget);

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    handleQuestion(input.value);
  });

  appendMessage('bot', 'Hello. I am R-Ignite&apos;s AI site guide. I can answer quick questions using the information on this website. ' + escapeHtml(getGreeting()), true);
  setQuickReplies(getQuickReplies());
})();
