import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env");
const envVars = Object.fromEntries(
    readFileSync(envPath, "utf-8")
        .split("\n")
        .filter(line => line.includes("="))
        .map(line => {
            const [key, ...rest] = line.split("=");
            return [key.trim(), rest.join("=").trim().replace(/^"|"$/g, "")];
        })
);

const app = initializeApp({
    apiKey: envVars.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: envVars.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: envVars.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: envVars.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: envVars.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: envVars.NEXT_PUBLIC_FIREBASE_APP_ID,
});

const db = getFirestore(app);

const PROJECTS = [
    {
        title: "Votex",
        techStack: ["Next.js", "Firebase", "Framer Motion"],
        category: "Web3 / Governance",
        description: "Developed a decentralized voting platform for transparent, blockchain-inspired result tracking.",
        isActive: true,
    },
    {
        title: "Coin Theater",
        techStack: ["React", "Supabase", "Chart.js"],
        category: "Fintech / Analytics",
        description: "Built an immersive crypto analytics suite with real-time price heatmaps and portfolio monitoring.",
        isActive: true,
    },
    {
        title: "All English SeTranslator",
        techStack: ["React Native", "Next.js"],
        category: "Mobile & Web App",
        description: "Built structured English learning platform with progress tracking & subscription system.",
        isActive: true,
    },
];

const EXPERIENCE = [
    {
        title: "MERN Stack Developer",
        company: "Artilence Lahore",
        date: "Feb 2025 - Present",
        description: [
            "Developed scalable SaaS applications using Next.js (improved load time by 30% via SSR & code-splitting).",
            "Built reusable modular components reducing feature development time by 25%.",
            "Developed cross-platform mobile apps with React Native (Android & iOS).",
            "Integrated third-party APIs (including Django services) improving workflow efficiency by 20%.",
        ].join("\n"),
        isActive: true,
        order: 0,
    },
];

async function seedCollection(collectionName, items, uniqueField) {
    const col = collection(db, collectionName);
    let added = 0, skipped = 0;
    for (const item of items) {
        const existing = await getDocs(query(col, where(uniqueField, "==", item[uniqueField])));
        if (!existing.empty) {
            console.log(`  ⟳ skipped: ${item[uniqueField]}`);
            skipped++;
            continue;
        }
        await addDoc(col, { ...item, createdAt: serverTimestamp() });
        console.log(`  ✓ added: ${item[uniqueField]}`);
        added++;
    }
    return { added, skipped };
}

console.log("\n🚀 Seeding Firestore...\n");
console.log("📁 projects");
const p = await seedCollection("projects", PROJECTS, "title");
console.log("\n📁 experience");
const e = await seedCollection("experience", EXPERIENCE, "title");
console.log(`\n✅ projects  → +${p.added} added, ${p.skipped} skipped`);
console.log(`✅ experience → +${e.added} added, ${e.skipped} skipped\n`);
process.exit(0);
