// bioScript.js - Add this as a separate file in your js folder

// Sample bio data - replace with actual team member information
const teamBios = {
    "Pakhi Gauba": "Founder, PressPeaK Pvt. Ltd. | CX Architect at TVS Motor Company She is the founder of PressPeaK Pvt. Ltd., a multilingual, discussion-driven content platform that is reshaping how stories are told and consumed. She was also the founding voice behind The Conflux Rivista Ltd. Her work lives at the intersection of community, creativity, and impact - always asking, \"What’s the story behind the scroll?\" Pakhi is a CX Architect at TVS Motor Company with a deep-rooted passion for building accessible, thoughtful experiences across products and content. Her expertise spans Product, Design, and Accessibility — always led by empathy and an eye for nuance. Over the last four years, she has held positions across global institutions including Acko General Insurance (Bengaluru), TCS R&D (Mumbai), the Belarusian Institute of Strategic Studies, the Ministry of Social Justice & Empowerment (GOI), Young India Foundation, and Amity School of Communication, among others.",
    
    "Alba Mc Vicar": "Alba, a 23-year-old Spanish-Scottish Journalism and Media graduate, explores how art and horror cinema reflect identity and society. She’s a purple-loving, live music enthusiast with a soft spot for cats and complex fantasy heroines.",
    
    "Kasamba Chipo Maango": "Kasamba Chipo Maango, a Zambian student of Communications in Journalism with a keen interest in storytelling, media, and the power of words to shape perspectives and inspire change.",
    
    "Isobel": "Isobel is a Politics and International Relations student. She is passionate about social affairs and pop culture hoping to pursue a career in communications. In her spare time she enjoys reading, writing and creating music.",
    
    "Timi Ayeni": "Timi Ayeni is a 21-year-old Nigerian Media and Communications student with a passion for books and a deep appreciation for all kinds of music. Inspired by Sir Francis Bacon’s quote, “Knowledge is power,” he aims to use storytelling to inform, empower, and connect with others.",
    
    "Oladolapo Oladogba": "A graduate of English Language, Oladolapo is a content creator with a strong interest in developing her skills and contributing to innovative projects.She has great interest in writing, editing, and proofreading.",

    "Harshit": "Harshit is a Full Stack Web Developer and iOS Developer known for his problem-solving skills, teamwork, and self-motivation. He is passionate about creating impactful digital experiences through clean, efficient, and user-focused applications. With a strong understanding of both frontend and backend technologies, he delivers seamless and scalable solutions.",

    "Shifa Mehra": "Shifa is a multidisciplinary writer and researcher rooted in media, culture, and communication. She turns nuance into impact—whether through sharp journalism, socially conscious design, or immersive visual storytelling. Equally fluent in Stuart Hall and viral infographics, she bridges theory and creativity with ease.",

    "Annabel Gowling": "Annabel is a second-year Politics student with a keen interest in humanitarian issues, global affairs, and investigative journalism. She recently backpacked across South America, documenting political observations and exploring regime change through lived experience. As Sports Editor at Exeposé, she’s honed her editorial, research, and communication skills across a wide range of topics. Her journalism work fuels her passion for global storytelling, while legal placements have sparked a growing interest in the intersection of law and politics, further sharpening her analytical and collaborative abilities.",

    "Hannah Combs": "Hannah holds a BA (Hons) in Journalism with Public Relations from the University of Salford. A passionate follower of UK politics and everyday British life, she brings a sharp eye and empathetic voice to the stories she tells. Outside of journalism, she’s a devoted theatre and film enthusiast—and a proud pet parent to three hamsters and a rabbit.",

    "Terrel Mollel": "Terrel is an intern at PressPeaK with keen interest in writing about Politics.",

    "Richa": "Passionate about storytelling and social impact, Richa brings experience in content writing, marketing, and nonprofit work. From leading NGO communications to heading MUN teams, she has seen how powerful storytelling drives connection and action. Currently a Journalism Intern at PressPeaK Pvt. Ltd., she focuses on amplifying unheard voices and meaningful perspectives.",

    "Sharmili Sanjeev": "Sharmili Sanjeev is a multifaceted professional driven by intellectual curiosity and creative passion. An aspiring writer, she crafts compelling narratives that captivate and inspire. Her keen interest in finance and economics fuels sharp analytical thinking as she explores complex market dynamics. While pursuing her bachelor’s degree, Sharmili balances academic rigor with creative pursuits, demonstrating a strong commitment to growth. A natural collaborator, she fosters innovation and connects ideas with strategic insight and artistic flair—poised to make a lasting impact in both literary and financial spheres.",
};

// Function to extract member name from team block
function getMemberNameFromTeamBlock(teamBlock) {
    const memberTitle = teamBlock.querySelector('.axil-member-title a');
    return memberTitle ? memberTitle.textContent.trim() : null;
}

// Create popup container on document load
document.addEventListener('DOMContentLoaded', () => {
    // Create popup element
    const popup = document.createElement('div');
    popup.className = 'bio-popup';
    popup.innerHTML = `
        <div class="bio-popup-content">
            <button class="bio-popup-close">&times;</button>
            <h2 class="bio-popup-title"></h2>
            <div class="bio-popup-text"></div>
        </div>
    `;
    document.body.appendChild(popup);
    
    // Add event listeners to team member name links
    const memberLinks = document.querySelectorAll('.axil-member-title a');
    memberLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const memberName = link.textContent.trim();
            showBioPopup(memberName);
        });
    });
    
    // Add event listeners to team member images
    const memberImages = document.querySelectorAll('.axil-team-block .img-container');
    memberImages.forEach(imageContainer => {
        imageContainer.addEventListener('click', (e) => {
            e.preventDefault();
            // Find the parent team block and extract member name
            const teamBlock = imageContainer.closest('.axil-team-block');
            const memberName = getMemberNameFromTeamBlock(teamBlock);
            if (memberName) {
                showBioPopup(memberName);
            }
        });
        
        // Add pointer cursor to indicate clickability
        imageContainer.style.cursor = 'pointer';
    });
    
    // Close popup when clicking the close button
    document.querySelector('.bio-popup-close').addEventListener('click', () => {
        document.querySelector('.bio-popup').classList.remove('active');
    });
    
    // Close popup when clicking outside the content
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.classList.remove('active');
        }
    });
});

// Function to show the popup with specific member bio
function showBioPopup(memberName) {
    const popup = document.querySelector('.bio-popup');
    const bioText = teamBios[memberName] || 'Bio information coming soon.';
    
    popup.querySelector('.bio-popup-title').textContent = memberName;
    popup.querySelector('.bio-popup-text').textContent = bioText;
    popup.classList.add('active');
}