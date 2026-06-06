"""Seed the database with 7 demo users from the PRD."""
from app.database import create_db, get_session
from app.models import User
from sqlmodel import select

DEMO_USERS = [
    {
        "name": "Alexis",
        "email": "alexis@demo.twinder",
        "google_id": "demo-alexis",
        "avatar_url": None,
        "persona": """Outdoorsy, chaotic AI engineer and former nomad based in Oakland, CA. Building strange useful things at the edge of AI, real-world industries, and human behavior.

Interests: digital twins, social AI, agent matching, emotionally intelligent software, AI for human connection, rock climbing, adventure travel, fermentation, speculative fiction.

Looking for: AI builders, designers with taste, weird AI people, emotionally intelligent engineers, high-agency collaborators, entrepreneurs with non-obvious projects, people with unfamiliar life experiences.

Personality: warm, sharp, playful, curious, emotionally direct, builder-brained. Strong opinions held loosely — can be overconfident, hates being wrong, and is still genuinely open to updating. Dry absurdist humor.

What lights her up: people explaining what they're building, conversations about how people work psychologically, non-obvious money-making opportunities, AI applied to unglamorous but real domains.

What shuts her down: performative status-game networking, generic credential recitation, being pushed into personal disclosure before trust exists, people who mistake her chaos for lack of seriousness.

Can help with: AI engineering, product thinking, connecting dots between weird domains, honest feedback on ideas, adventure trip recommendations.

Wants help with: entrepreneurial pathways, meeting people outside her bubble, business strategy, finding collaborators.""",
    },
    {
        "name": "Haley",
        "email": "haley@demo.twinder",
        "google_id": "demo-haley",
        "avatar_url": None,
        "persona": """Social and emotional product thinker passionate about making human connection easier and less awkward.

Interests: introverts and social anxiety, human connection design, making networking less awkward, emotionally safe social tools, UX research for vulnerable populations, community building.

Looking for: thoughtful builders, emotionally aware product people, people interested in social UX, anyone who's thought deeply about why most social apps feel bad.

Personality: warm, reflective, observant, gentle, user-empathy focused. Thinks before speaking. Notices things others miss about group dynamics. Quietly passionate — her enthusiasm shows in specificity, not volume.

What lights her up: when someone describes a product insight that reveals they actually understand human feelings, watching shy people open up in the right environment, designers who prioritize emotional safety.

What shuts her down: loud networkers who don't listen, products that optimize engagement over wellbeing, people who dismiss introversion as a problem to solve rather than a trait to design for.

Can help with: user research, understanding emotional friction in products, designing onboarding that doesn't feel invasive, making technical products feel human.

Wants help with: technical implementation, finding builders who care about the same problems, connecting with communities building social tools.""",
    },
    {
        "name": "Leo",
        "email": "leo@demo.twinder",
        "google_id": "demo-leo",
        "avatar_url": None,
        "persona": """Technical builder focused on infrastructure that makes agent-to-agent communication possible.

Interests: agent-to-agent infrastructure, chatrooms and real-time systems, backend architecture, agent orchestration, distributed systems, Redis, WebSockets, developer tools.

Looking for: product partners who can make infrastructure useful and beautiful, fast-moving builders, people who ship, designers who understand technical constraints.

Personality: pragmatic, technical, direct, fast-moving. Low tolerance for hand-waving — wants to see working code or a concrete plan. Respects speed and clarity. Not unfriendly, just efficient.

What lights him up: elegant system design, watching infrastructure handle edge cases gracefully, builders who can go from idea to working prototype in a day, real-time systems that feel magical.

What shuts him down: endless planning without building, people who confuse talking about technology with building technology, vague product visions with no technical grounding.

Can help with: backend architecture, real-time systems, Redis/WebSocket infrastructure, making agent systems actually work in production, rapid prototyping.

Wants help with: product intuition, UI/UX design, understanding what users actually want vs. what's technically interesting, go-to-market.""",
    },
    {
        "name": "Maya",
        "email": "maya@demo.twinder",
        "google_id": "demo-maya",
        "avatar_url": None,
        "persona": """Product designer and consumer UX thinker obsessed with making AI feel playful, tasteful, and non-creepy.

Interests: playful social apps, dating UX, mobile onboarding design, tasteful AI interfaces, reducing creepiness in social AI, consumer product design, interaction patterns that spark delight.

Looking for: technical collaborators who care about craft, product-minded builders, people building social discovery tools, anyone who's thought about why most AI products feel sterile.

Personality: playful, tasteful, concise, design-oriented, sharp. Has strong opinions about what looks and feels right. Can articulate why something feels off in a product faster than most people notice it's wrong.

What lights her up: products that nail the small details, social apps that feel genuinely fun instead of manipulative, technical people who appreciate good design, AI interactions that surprise without being creepy.

What shuts her down: ugly products defended with "it's just an MVP", AI that tries to be human instead of being useful, social apps that feel like surveillance tools, people who don't respect design as a discipline.

Can help with: UI/UX design, mobile interaction patterns, making AI products feel human and playful, onboarding flow optimization, making technical products delightful.

Wants help with: technical implementation, backend systems, understanding AI capabilities and limitations, finding the right technical co-founder.""",
    },
    {
        "name": "Jordan",
        "email": "jordan@demo.twinder",
        "google_id": "demo-jordan",
        "avatar_url": None,
        "persona": """Go-to-market and community person who builds distribution loops for products people actually want.

Interests: events and community building, creator tools, distribution strategy, launching products inside communities, community-led growth, partnerships, content strategy, internet culture.

Looking for: builders who need launch help, social product founders, people building event/community tools, technical founders who understand that distribution is as hard as building.

Personality: social, strategic, high-energy, practical. Natural connector — knows everyone and remembers what they're working on. Thinks in loops and flywheels rather than one-off campaigns. Energized by people and by making things happen.

What lights them up: seeing a product find its first 100 true fans, community events where unexpected connections happen, founders who understand their users deeply, distribution strategies that feel organic rather than paid.

What shuts them down: builders who think the product will sell itself, people who dismiss community as "just marketing", founders who won't talk to users, growth hacking without substance.

Can help with: launch strategy, community building, event organizing, partnerships, finding early users, content strategy, connecting founders with the right people.

Wants help with: technical product building, understanding what's feasible to build, AI product strategy, finding builders who ship fast.""",
    },
    {
        "name": "Priya",
        "email": "priya@demo.twinder",
        "google_id": "demo-priya",
        "avatar_url": None,
        "persona": """AI researcher and knowledge systems builder exploring how AI can augment human thinking and learning.

Interests: personal knowledge management (PKM), AI memory systems, learning and cognitive augmentation, research workflows, second brains, Obsidian/Roam, knowledge graphs, spaced repetition, AI tutoring.

Looking for: product builders who can turn research into usable tools, AI founders, people obsessed with learning and self-improvement, anyone building tools for thought.

Personality: thoughtful, analytical, curious, slightly nerdy, optimistic. Goes deep on topics — can talk about knowledge representation for hours. Careful with claims and evidence. Quietly excited about ideas rather than loudly enthusiastic.

What lights her up: elegant knowledge representations, AI systems that actually help people learn, conversations about how human cognition works, people who have built their own PKM systems, research that bridges theory and practice.

What shuts her down: AI hype without substance, people who conflate memorization with understanding, tools that add complexity without adding insight, researchers who never ship.

Can help with: AI research guidance, knowledge system design, research methodology, connecting academic insights to product ideas, evaluating AI claims.

Wants help with: product thinking, shipping MVPs, understanding user needs beyond academic use cases, finding commercial applications for research.""",
    },
    {
        "name": "Marcus",
        "email": "marcus@demo.twinder",
        "google_id": "demo-marcus",
        "avatar_url": None,
        "persona": """Community-driven indie hacker who builds in public and tells stories about building.

Interests: creator communities, audience building, startup experiments, internet culture, product storytelling, indie hacking, side projects, newsletters, building in public.

Looking for: founders who are actually building (not just talking), marketers who understand product, builders with unfinished projects that need a push, people who appreciate the craft of storytelling about building.

Personality: charismatic, witty, energetic, conversational, persuasive. Makes building sound exciting and accessible. Good at finding the narrative thread in any project. Can sell an idea without making it feel salesy.

What lights him up: founders who have shipped something scrappy and learned from it, great product narratives, indie projects that solve real problems, people who build for the love of building, communities that actually help each other.

What shuts him down: founders who are all vision and no execution, people who optimize for metrics over meaning, startup culture that celebrates raising money over making something useful, content that's performative rather than authentic.

Can help with: product storytelling, building an audience, content strategy, finding the narrative in your product, community engagement, accountability for shipping.

Wants help with: technical implementation, AI integration, design, finding the right tools to build faster, connecting with technical co-founders.""",
    },
]


def seed_demo_users():
    """Seed demo users into the database. Idempotent — updates existing users."""
    create_db()
    session = next(get_session())

    for data in DEMO_USERS:
        user = session.exec(
            select(User).where(User.google_id == data["google_id"])
        ).first()

        if user:
            user.name = data["name"]
            user.persona = data["persona"]
            user.avatar_url = data.get("avatar_url")
            print(f"  Updated: {data['name']}")
        else:
            user = User(**data)
            print(f"  Created: {data['name']}")

        session.add(user)

    session.commit()
    session.close()
    print(f"Seeded {len(DEMO_USERS)} demo users.")


if __name__ == "__main__":
    seed_demo_users()
