---

---
# Pallidocs website

#### _Website for hosting Pallidocs films and the Pallidocs forms experience._

Hosted by **Netlify** [app.netlify.com](app.netlify.com)

Content managed with **Forestry** [forestry.io](www.forestry.io)

Built using **Jekyll** static site generator and **Node** package manager

---

# Guide to site updates with Forestry

## Background videos
- **Background Video:** Vimeo embed URL for the 16:9 video to play in the site background.
- **Loading Image:** This will display in place of the background video while the video is being loaded. Ideally this will be a still of the video's first frame.
- **Mobile Background Image:** Should be between 2:3 proportion (portrait). This will be used in place of a video when viewing on mobile.

---

## Home page
- **Paragraphs:** Text blocks that appear sequentially while scrolling the page.

#### Films
- **Title:** Film title
- **Preview Video:** Short looping video that plays when hovering over the film banner.
- **Embed URL:** Link to the full film on Vimeo. Opens when clicking the film.
- **Description:** Paragraph text that appears below the film banner.
- **Extra:** Subtle text that appears below the description.

---

## Questions page

#### Audio
- **Media:** URL to audio track. Can be mp4 or mp3.
- **Playtext:** Shows while music is paused.
- **Pausetext:** Shows while music is playing.

#### Intro
Text on intro section of questions page.
- **Paragraphs:** Initial text divided into paragraphs.
- **Quote:** Stylized text following paragraphs.
- **Ask:** Text right before button that takes the user to the questions view.
- **ButtonText:** Text displayed on button that takes user to the questions view.

#### Questions
- **Question:** Question text.
- **AskFirst:** (_Currently not used_) Will ask the user before displaying a question, giving them the option to skip it. Designed to circumnavigate questions that cover a topic that may be upsetting to some users.
- **Video/Loading Image:** _Refer to 'Background Videos' note at top._

#### PrevButtonText/NextButtonText
The text used on the next/previous buttons.

#### FinishText
Ask the user if they'd like a downloadable copy of their responses.

#### Download Button Text
Text on the button that initiates downloading the form. Next step will include the healthcare agent information.

#### Healthcare Agent Text
Text asking the user who their healthcare agent is.

#### Healthcare Agent Info
Each value will show up as a text field below the Healthcare Agent Text, after a user chooses to receive a downloaded copy of their responses. These and the values entered into the text fields will appear on the downloadable form.

---

## Contact page

- **Contact Message:** Text displayed before the contact form.

---

## Site information
###### _'Settings' in Forestry sidebar_

- **URL:** Public URL of the website.

No need to change anything else.

---

## Notes
- For all text, typing `<br>` will add a single line break (same as typing 'enter').
- **DON'T** change any values titled "Layout"!