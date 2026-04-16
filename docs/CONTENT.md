# Content Management Guide

Guide for updating content on the association website.

## Overview

Content can be updated through:
1. **Database**: For dynamic content (events, committee members)
2. **Code**: For static content (text, images, styling)
3. **Storage**: For files (brochures, documents)

## Updating Events

### Adding New Events

1. Go to Supabase Dashboard → Table Editor
2. Select `events` table
3. Click **Insert row**
4. Fill in the fields:
   - `title`: Event name
   - `description`: Full event description
   - `date`: Event date (YYYY-MM-DD format)
   - `time`: Start time (HH:MM format)
   - `location`: Venue address
   - `image_url`: URL to event image
   - `category`: Type (Conference, Workshop, Networking, Social)
   - `status`: upcoming or past
   - `price`: Ticket price in euros
   - `max_attendees`: Maximum capacity
5. Click **Save**

### Editing Events

1. Find event in Table Editor
2. Click the row to edit
3. Update fields
4. Click **Save**

### Deleting Events

1. Select event row
2. Click delete icon
3. Confirm deletion

## Updating Committee Members

### Adding Team Members

1. Go to Table Editor → `committee_members`
2. Click **Insert row**
3. Fill in:
   - `name`: Full name
   - `role`: Position/title
   - `bio`: Brief biography
   - `image_url`: Profile photo URL
   - `order`: Display order (lower numbers appear first)
4. Click **Save**

### Updating Team Members

Follow same process as editing events.

## Updating Static Content

### Home Page

Edit `/src/app/pages/Home.tsx`:

**Mission Statement** (line ~85):
```typescript
<p className="text-lg text-gray-700 leading-relaxed">
  We are committed to fostering... [Your mission text]
</p>
```

**Featured Events** (line ~60):
Update the `featuredEvents` array with your event IDs.

### About Page

Edit `/src/app/pages/About.tsx`:

**Story Section** (line ~85):
```typescript
<p>
  Founded in 2010... [Your story]
</p>
```

**Core Values** (line ~120):
Update the `coreValues` array with your values.

**Contact Information** (line ~220):
Update address, phone, email in the Contact Details card.

### Footer

Edit `/src/app/components/Footer.tsx`:

**Social Media Links** (line ~25):
```typescript
<a href="#" className="...">  {/* Update href */}
  <Facebook className="h-5 w-5" />
</a>
```

**Contact Info** (line ~75):
Update address, phone, email.

## Updating Images

### Using Unsplash (Free Stock Photos)

Replace image URLs with Unsplash links:
```typescript
src="https://images.unsplash.com/photo-[ID]"
```

### Using Your Own Images

1. Upload to Supabase Storage:
   - Go to Storage in Supabase
   - Create a bucket for images
   - Upload files
   - Get public URL

2. Update code with new URL:
   ```typescript
   src="https://[project].supabase.co/storage/v1/object/public/[bucket]/[file]"
   ```

## Updating Brochure

### Upload New Brochure

1. Navigate to `/partnership` on your website
2. Scroll to "Upload Partnership Brochure" section
3. Click **Select PDF File**
4. Choose your PDF (max 10MB)
5. Click **Upload Brochure**
6. Verify download link works

### Replace Existing Brochure

Simply upload a new file - it will replace the old one automatically.

## Updating Membership Plans

Edit `/src/app/pages/Membership.tsx`:

**Plans** (line ~20):
```typescript
const membershipPlans = [
  {
    type: 'individual',
    name: 'Individual Membership',
    price: 100,  // Update price
    description: '...',  // Update description
    features: [...]  // Update features list
  },
  // ... more plans
];
```

**Update Payment page** too (`/src/app/pages/Payment.tsx` line ~75) to match prices.

## Updating Partnership Tiers

Edit `/src/app/pages/Partnership.tsx`:

**Partnership Tiers** (line ~120):
```typescript
<Card>
  <CardTitle>Bronze Partner</CardTitle>
  <span className="text-3xl">€2,500</span>  {/* Update price */}
  {/* Update benefits list */}
</Card>
```

## Brand Customization

### Colors

Update `/src/styles/theme.css`:

```css
:root {
  --primary: #0c1c3b;  /* Your brand color */
  /* Add more color variables */
}
```

Or update inline in components:
- Header: `/src/app/components/Header.tsx` (line 40)
- Buttons: Throughout various files
- Cards and accents: Various components

### Fonts

Edit `/src/styles/fonts.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Your+Font&display=swap');

body {
  font-family: 'Your Font', sans-serif;
}
```

### Logo

Update Header component (`/src/app/components/Header.tsx` line 25):

Replace logo placeholder with your logo:
```typescript
<div className="w-12 h-12 bg-white rounded-full">
  <img src="/your-logo.png" alt="Logo" />
</div>
```

## Text Content

### Navigation Links

Edit `/src/app/components/Header.tsx` (line 7):
```typescript
const navigation = [
  { name: 'Home', href: '/' },
  // Update names and links
];
```

### Meta Information

For SEO, add to each page:
```typescript
useEffect(() => {
  document.title = 'Your Page Title - Association Name';
}, []);
```

## Forms

### Contact Form

Form saves to `contact_submissions` table automatically.

To receive email notifications:
1. Set up Supabase email webhooks
2. Or use a service like SendGrid
3. Configure in Edge Functions

### Membership Form

Form saves to `membership_applications` table.

To add fields:
1. Update database schema
2. Update form in `/src/app/pages/Membership.tsx`
3. Update submission logic

## Content Best Practices

1. **Keep it current**: Update events regularly
2. **Use quality images**: High-resolution, relevant photos
3. **Write clearly**: Professional, concise language
4. **Test changes**: Preview before publishing
5. **Backup first**: Export data before major changes
6. **Mobile-friendly**: Check content on mobile devices
7. **Accessibility**: Use descriptive alt text for images

## Content Calendar

Suggested update schedule:

- **Weekly**: Add new events, check calendar
- **Monthly**: Review membership applications, update news
- **Quarterly**: Update committee members, refresh testimonials
- **Annually**: Update prices, review all static content

## Getting Images

### Free Stock Photos

- [Unsplash](https://unsplash.com) - High-quality free images
- [Pexels](https://pexels.com) - Free stock photos
- [Pixabay](https://pixabay.com) - Free images and videos

### Image Guidelines

- **Format**: JPG for photos, PNG for graphics with transparency
- **Size**: Max 1920px width for hero images, 800px for cards
- **Optimization**: Compress before upload (use TinyPNG, ImageOptim)
- **Alt text**: Always add descriptive alt text for accessibility

## Support

Need help updating content? Contact mox@polytechnique.fr
