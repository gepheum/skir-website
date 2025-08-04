// Documentation-specific JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize documentation features
    initializeSidebarNavigation();
    initializeTabFunctionality();
    initializeTableOfContents();
    initializeCodeCopyButtons();
    initializeSmoothScrolling();
});

// Sidebar navigation with scroll spy
function initializeSidebarNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar-section a[href^="#"]');
    const sections = document.querySelectorAll('.docs-section[id]');
    
    // Update active link based on scroll position
    function updateActiveLink() {
        let current = '';
        const scrollPos = window.scrollY + 100; // Offset for fixed header
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }
    
    // Add scroll listener
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Initial call
    
    // Handle sidebar link clicks
    sidebarLinks.forEach(link => {
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
}

// Enhanced tab functionality for documentation
function initializeTabFunctionality() {
    const tabContainers = document.querySelectorAll('.tab-container');
    
    tabContainers.forEach(container => {
        const tabButtons = container.querySelectorAll('.tab-btn');
        const tabPanes = container.querySelectorAll('.tab-pane');
        
        function switchTab(activeTabId) {
            // Remove active class from all buttons and panes in this container
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to selected button and pane
            const activeButton = container.querySelector(`[data-tab="${activeTabId}"]`);
            const activePane = container.querySelector(`#${activeTabId}`);
            
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
        if (!container.querySelector('.tab-btn.active')) {
            const firstTab = tabButtons[0];
            if (firstTab) {
                const firstTabId = firstTab.getAttribute('data-tab');
                switchTab(firstTabId);
            }
        }
    });
}

// Generate table of contents for long sections
function initializeTableOfContents() {
    const headings = document.querySelectorAll('.docs-content h2, .docs-content h3, .docs-content h4');
    
    headings.forEach((heading, index) => {
        // Add IDs to headings that don't have them
        if (!heading.id) {
            const text = heading.textContent.toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-');
            heading.id = `heading-${index}-${text}`;
        }
    });
}

// Enhanced code copy functionality
function initializeCodeCopyButtons() {
    const codeBlocks = document.querySelectorAll('.code-example pre code');
    
    codeBlocks.forEach(block => {
        const wrapper = block.closest('.code-example');
        if (wrapper && !wrapper.querySelector('.copy-btn')) {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.innerHTML = '📋';
            copyBtn.setAttribute('title', 'Copy code');
            
            const header = wrapper.querySelector('.code-header');
            if (header) {
                header.style.position = 'relative';
                header.appendChild(copyBtn);
                
                // Style the copy button
                Object.assign(copyBtn.style, {
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#6b7280',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    borderRadius: '0.25rem',
                    transition: 'all 0.2s ease',
                    fontSize: '0.875rem'
                });
                
                copyBtn.addEventListener('mouseenter', () => {
                    copyBtn.style.background = 'rgba(102, 126, 234, 0.1)';
                    copyBtn.style.color = '#667eea';
                });
                
                copyBtn.addEventListener('mouseleave', () => {
                    copyBtn.style.background = 'transparent';
                    copyBtn.style.color = '#6b7280';
                });
                
                copyBtn.addEventListener('click', async () => {
                    try {
                        const codeText = block.textContent || block.innerText;
                        await navigator.clipboard.writeText(codeText);
                        
                        copyBtn.innerHTML = '✅';
                        copyBtn.style.color = '#10b981';
                        
                        setTimeout(() => {
                            copyBtn.innerHTML = '📋';
                            copyBtn.style.color = '#6b7280';
                        }, 2000);
                    } catch (err) {
                        console.error('Failed to copy code:', err);
                        copyBtn.innerHTML = '❌';
                        copyBtn.style.color = '#ef4444';
                        
                        setTimeout(() => {
                            copyBtn.innerHTML = '📋';
                            copyBtn.style.color = '#6b7280';
                        }, 2000);
                    }
                });
            }
        }
    });
}

// Enhanced smooth scrolling for documentation
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update URL without triggering navigation
                if (history.pushState) {
                    history.pushState(null, null, href);
                }
            }
        });
    });
}

// Search functionality (future enhancement)
function initializeSearch() {
    // Placeholder for search functionality
    // Could implement full-text search through the documentation
    const searchInput = document.querySelector('#docs-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            // Implement search logic here
        });
    }
}

// Mobile sidebar toggle (for future mobile improvements)
function initializeMobileSidebar() {
    const toggleBtn = document.querySelector('#sidebar-toggle');
    const sidebar = document.querySelector('.docs-sidebar');
    
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            }
        });
    }
}

// Print functionality
function initializePrintSupport() {
    // Add print styles and functionality
    const printBtn = document.querySelector('#print-docs');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // Quick navigation with keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'k':
                e.preventDefault();
                // Focus search if available
                const search = document.querySelector('#docs-search');
                if (search) search.focus();
                break;
        }
    }
});

// Theme handling (if we add dark mode later)
function initializeTheme() {
    const themeToggle = document.querySelector('#theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            localStorage.setItem('theme', 
                document.body.classList.contains('dark-theme') ? 'dark' : 'light'
            );
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }
}
