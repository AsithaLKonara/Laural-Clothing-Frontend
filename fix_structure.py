import os

# Navbar
path = 'components/Navbar.tsx'
with open(path, 'r') as f:
    c = f.read()
c = c.replace('className="relative w-32 h-10"', 'className="relative w-40 h-12"')
with open(path, 'w') as f:
    f.write(c)

# Footer
path = 'components/Footer.tsx'
with open(path, 'r') as f:
    c = f.read()
c = c.replace('className="relative w-40 h-12 mb-6"', 'className="relative w-48 h-16 mb-6"')
with open(path, 'w') as f:
    f.write(c)

# Sidebar
path = 'components/dashboard/Sidebar.tsx'
with open(path, 'r') as f:
    c = f.read()
if '<div className="w-8 h-8 bg-foreground' in c:
    import re
    # Remove the 3 lines of the div
    c = re.sub(r'<div className="w-8 h-8 bg-foreground.*?>\s*.*?\s*</div>\s*', '', c, flags=re.DOTALL)
    c = c.replace('href="/admin"', 'href="/"')
with open(path, 'w') as f:
    f.write(c)
