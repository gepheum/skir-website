// Tab functionality for code examples
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    function switchTab(activeTabId) {
        // Remove active class from all buttons and panes
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        // Add active class to selected button and pane
        const activeButton = document.querySelector(`[data-tab="${activeTabId}"]`);
        const activePane = document.getElementById(activeTabId);
        
        if (activeButton && activePane) {
            activeButton.classList.add('active');
            activePane.classList.add('active');
        }
    }
    
    // Add click listeners to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    
    // Initialize first tab as active if no active tab is set
    if (!document.querySelector('.tab-btn.active')) {
        const firstTab = tabButtons[0];
        if (firstTab) {
            const firstTabId = firstTab.getAttribute('data-tab');
            switchTab(firstTabId);
        }
    }
});

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Navbar background on scroll
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    
    function updateNavbar() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }
    
    window.addEventListener('scroll', updateNavbar);
    updateNavbar(); // Initial call
});

// Copy code functionality
document.addEventListener('DOMContentLoaded', function() {
    const codeBlocks = document.querySelectorAll('.code-content code');
    
    codeBlocks.forEach(block => {
        // Add copy button to code blocks
        const wrapper = block.closest('.code-block');
        if (wrapper && !wrapper.querySelector('.copy-btn')) {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.innerHTML = '📋';
            copyBtn.setAttribute('title', 'Copy code');
            
            const header = wrapper.querySelector('.code-header');
            if (header) {
                header.style.position = 'relative';
                header.appendChild(copyBtn);
                
                copyBtn.style.position = 'absolute';
                copyBtn.style.right = '1rem';
                copyBtn.style.top = '50%';
                copyBtn.style.transform = 'translateY(-50%)';
                copyBtn.style.background = 'transparent';
                copyBtn.style.border = 'none';
                copyBtn.style.color = '#a3a3a3';
                copyBtn.style.cursor = 'pointer';
                copyBtn.style.padding = '0.5rem';
                copyBtn.style.borderRadius = '0.25rem';
                copyBtn.style.transition = 'all 0.2s ease';
                
                copyBtn.addEventListener('mouseenter', () => {
                    copyBtn.style.background = 'rgba(255, 255, 255, 0.1)';
                    copyBtn.style.color = '#e5e5e5';
                });
                
                copyBtn.addEventListener('mouseleave', () => {
                    copyBtn.style.background = 'transparent';
                    copyBtn.style.color = '#a3a3a3';
                });
                
                copyBtn.addEventListener('click', async () => {
                    try {
                        await navigator.clipboard.writeText(block.textContent);
                        copyBtn.innerHTML = '✅';
                        setTimeout(() => {
                            copyBtn.innerHTML = '📋';
                        }, 2000);
                    } catch (err) {
                        console.error('Failed to copy code:', err);
                        copyBtn.innerHTML = '❌';
                        setTimeout(() => {
                            copyBtn.innerHTML = '📋';
                        }, 2000);
                    }
                });
            }
        }
    });
});

// Intersection Observer for animations
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for fade-in animation
    const animateElements = document.querySelectorAll('.feature-card, .tool-card, .step');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Form handling (if we add a contact form later)
function handleFormSubmit(form) {
    // Placeholder for form submission logic
    console.log('Form submitted:', new FormData(form));
    return false; // Prevent actual submission
}

// Search functionality (placeholder for future implementation)
function initializeSearch() {
    // Placeholder for search functionality
    // Could be used for documentation search
}
