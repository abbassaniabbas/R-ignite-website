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
      'Which sectors do you serve?',
      'Do you build software products?',
      'How do we get started?'
    ],
    'about.html': [
      'What does R-Ignite do?',
      'What makes you different?',
      'Which sectors do you serve?',
      'How do we get started?'
    ],
    'services.html': [
      'Break down your service pillars',
      'Do you offer AI and data work?',
      'Do you build portals or apps?',
      'Do you work on drones or IoT?'
    ],
    'team.html': [
      'Who leads R-Ignite?',
      'How do I contact the team?',
      'Where are you based?',
      'What services do you offer?'
    ],
    'contact.html': [
      'How fast do you respond?',
      'What services do you offer?',
      'Do you work with government or banks?',
      'What is your website?'
    ]
  };

  var greetingMap = {
    'services.html': 'Ask about the four service pillars, sectors we serve, or the best place to start.',
    'team.html': 'Ask about the founders, leadership focus, or how to reach the team.',
    'contact.html': 'If you want a quick answer before filling the form, I can help here first.'
  };

  var widget = document.createElement('section');
  widget.className = 'ri-chatbot';
  widget.setAttribute('aria-label', 'R-Ignite AI assistant');
  widget.innerHTML = [
    '<div class="ri-chatbot-panel" id="ri-chatbot-panel" role="dialog" aria-modal="false" aria-hidden="true">',
      '<div class="ri-chatbot-head">',
        '<div><h2>R-Ignite AI</h2></div>',
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
          '<input id="riChatbotInput" class="ri-chatbot-input" type="text" autocomplete="off" placeholder="Ask about AI, software, sectors, or next steps..." />',
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
  var hasOpened = false;

  var intents = [
    {
      keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
      answer: function () {
        return {
          html: 'Hello. I answer using the information on this website. ' + escapeHtml(getGreeting()),
          replies: getQuickReplies()
        };
      }
    },
    {
      keywords: ['what is r ignite', 'what is r-ignite', 'who are you', 'what do you do', 'about r ignite', 'about r-ignite'],
      answer: function () {
        return {
          html: 'R-Ignite Solutions Limited is a Nigerian technology company delivering AI, data, software, and emerging technology solutions for forward-looking organisations.',
          replies: ['What services do you offer?', 'Which sectors do you serve?', 'How do we get started?']
        };
      }
    },
    {
      keywords: ['services', 'service pillars', 'what services do you offer', 'what can you help with', 'offer'],
      answer: function () {
        return {
          html: 'The company&apos;s four core service pillars are AI &amp; Data Intelligence, Software Engineering &amp; Digital Products, Emerging Technology &amp; Hardware Research, and Technology Advisory &amp; Digital Transformation.',
          replies: ['Do you offer AI and data work?', 'Do you build portals or apps?', 'Do you work on drones or IoT?']
        };
      }
    },
    {
      keywords: ['ai', 'data', 'dashboard', 'reporting', 'analytics', 'predictive', 'business intelligence'],
      answer: function () {
        return {
          html: 'Yes. R-Ignite&apos;s strongest pillar is AI &amp; Data Intelligence, including analytics, dashboards, reporting systems, workflow automation, predictive analytics, data modelling, reconciliation, and responsible AI advisory.',
          replies: ['Do you build software products?', 'Which sectors do you serve?', 'How do we get started?']
        };
      }
    },
    {
      keywords: ['software', 'portal', 'app', 'application', 'saas', 'mobile', 'api', 'customer portal'],
      answer: function () {
        return {
          html: 'Yes. R-Ignite builds software and digital products such as web applications, SaaS platforms, internal systems, customer portals, mobile applications, and integrated database-backed tools.',
          replies: ['Do you offer AI and data work?', 'Do you work with banks or government?', 'How do we get started?']
        };
      }
    },
    {
      keywords: ['drone', 'uav', 'iot', 'sensor', 'robotics', 'hardware', 'prototype', 'emerging technology'],
      answer: function () {
        return {
          html: 'Yes. R-Ignite has an Emerging Technology &amp; Hardware Research pillar covering drone and UAV use-case research, IoT and sensor systems, field data collection concepts, hardware-software integration, and prototype development. The site presents this work as research and prototyping subject to applicable requirements where relevant.',
          replies: ['Which sectors do you serve?', 'Do you also give advisory support?', 'How do we get started?']
        };
      }
    },
    {
      keywords: ['advisory', 'strategy', 'transformation', 'audit', 'readiness', 'roadmap', 'architecture'],
      answer: function () {
        return {
          html: 'Yes. R-Ignite provides technology advisory and digital transformation support including technology audits, product strategy, data maturity assessment, AI readiness assessment, automation advisory, and software architecture guidance.',
          replies: ['What services do you offer?', 'Which sectors do you serve?', 'How do we get started?']
        };
      }
    },
    {
      keywords: ['sector', 'industry', 'industries', 'banks', 'government', 'schools', 'health', 'logistics', 'agriculture'],
      answer: function () {
        return {
          html: 'The site positions R-Ignite for financial services, government and public sector, education, agriculture, health, logistics, real estate and construction, and SMEs or enterprise operations.',
          replies: ['Do you build software products?', 'Do you offer AI and data work?', 'Where are you based?']
        };
      }
    },
    {
      keywords: ['pricing', 'price', 'cost', 'quote', 'budget', 'how much'],
      answer: function () {
        return {
          html: 'The site does not publish fixed prices. R-Ignite is positioned as a premium company, so pricing depends on scope, systems involved, and the outcome you need. The best next step is the <a href="' + contactLink + '">Get in Touch page</a>.',
          replies: ['How do we get started?', 'What services do you offer?', 'How fast do you respond?']
        };
      }
    },
    {
      keywords: ['how do we get started', 'get started', 'start', 'next step'],
      answer: function () {
        return {
          html: 'The best starting point is a focused conversation about your organisation, the challenge you want to solve, and whether the right route is AI and data work, software engineering, advisory, or emerging technology research. You can begin on the <a href="' + contactLink + '">Get in Touch page</a>.',
          replies: ['What services do you offer?', 'How fast do you respond?', 'How do I contact the team?']
        };
      }
    },
    {
      keywords: ['contact', 'support', 'email', 'phone', 'call', 'reach', 'talk to someone'],
      answer: function () {
        return {
          html: 'You can reach the team through the <a href="' + contactLink + '">Get in Touch page</a>. The public contact details on the site include abbassani@r-ignite.com, samuelurieto@r-ignite.com, and the phone numbers +234 703 057 9173 and +234 807 885 1998.',
          replies: ['How fast do you respond?', 'Where are you located?', 'What is your website?']
        };
      }
    },
    {
      keywords: ['where are you based', 'where are you located', 'location', 'abuja', 'address'],
      answer: function () {
        return {
          html: 'R-Ignite is based in Abuja. The address shown on the site is House 1, Shekinah Luxury Estate, Apo, Abuja, Nigeria.',
          replies: ['How do I contact the team?', 'How fast do you respond?', 'Which sectors do you serve?']
        };
      }
    },
    {
      keywords: ['response', 'reply', 'how fast', 'how long', 'when will you reply'],
      answer: function () {
        return {
          html: 'The site says the team typically replies within 24 hours, Monday to Friday, 8am to 6pm WAT.',
          replies: ['How do we get started?', 'What services do you offer?', 'How do I contact the team?']
        };
      }
    },
    {
      keywords: ['founder', 'founders', 'leadership', 'team', 'ceo', 'cto', 'who leads'],
      answer: function () {
        return {
          html: 'R-Ignite is led by Abbas S. Abbas, Co-Founder and Chief Executive Officer, and Samuel E. Urieto, Co-Founder and Chief Technology Officer.',
          replies: ['How do I contact the team?', 'What services do you offer?', 'Where are you based?']
        };
      }
    },
    {
      keywords: ['website', 'site link', 'web address'],
      answer: function () {
        return {
          html: 'The website listed on the site is <a href="' + websiteLink + '" target="_blank" rel="noopener">www.rignitegroup.com</a>.',
          replies: ['How do I contact the team?', 'What services do you offer?', 'Where are you located?']
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
    return greetingMap[pageId] || 'Ask about services, sectors, leadership, location, response times, or next steps.';
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

  function renderReplies(replies) {
    quickReplies.innerHTML = '';
    (replies || []).forEach(function (reply) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'ri-chatbot-reply';
      button.textContent = reply;
      button.addEventListener('click', function () {
        handleQuery(reply);
      });
      quickReplies.appendChild(button);
    });
  }

  function matchIntent(query) {
    var normalized = normalize(query);

    for (var i = 0; i < intents.length; i += 1) {
      var intent = intents[i];
      for (var j = 0; j < intent.keywords.length; j += 1) {
        if (normalized.indexOf(normalize(intent.keywords[j])) !== -1) {
          return intent.answer(normalized);
        }
      }
    }

    return {
      html: 'I can help with questions about R-Ignite&apos;s service pillars, sectors, leadership, location, response times, and next steps. If you need a tailored discussion, please use the <a href="' + contactLink + '">Get in Touch page</a>.',
      replies: getQuickReplies()
    };
  }

  function handleQuery(question) {
    appendMessage('user', question, false);
    var answer = matchIntent(question);
    appendMessage('bot', answer.html, true);
    renderReplies(answer.replies);
  }

  function setOpenState(isOpen) {
    widget.classList.toggle('is-open', isOpen);
    panel.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    launcher.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

    if (isOpen) {
      if (!hasOpened) {
        appendMessage('bot', 'Hello. I am R-Ignite AI. ' + escapeHtml(getGreeting()), false);
        renderReplies(getQuickReplies());
        hasOpened = true;
      }
      setTimeout(function () {
        input.focus();
      }, 80);
    }
  }

  launcher.addEventListener('click', function () {
    setOpenState(!widget.classList.contains('is-open'));
  });

  closeButton.addEventListener('click', function () {
    setOpenState(false);
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var question = input.value.trim();
    if (!question) {
      return;
    }
    input.value = '';
    handleQuery(question);
  });
})();
