// Edit this list to update the home and portfolio pages.
// `live` is optional: projects without one only show a GitHub link.
const GITHUB = 'https://github.com/atpsk8';

module.exports = {
    owner: {
        name: 'Andrew',
        github: GITHUB,
        email: 'atpsk8@gmail.com',
        // Shown on the home page as a code snippet. Values can be strings, arrays of strings, or booleans.
        about: {
            role: 'Full-stack web developer',
            stack: ['JavaScript', 'React', 'Node', 'Express'],
            currentlyLearning: 'TypeScript',
            openToWork: true,
        },
    },
    projects: [
        {
            name: 'JobTracker',
            description: 'An application tracker and interview organizer for keeping a job search on track.',
            tech: ['React', 'JavaScript'],
            repo: `${GITHUB}/JobTracker`,
            live: 'https://jobtracker-eight-liard.vercel.app',
            featured: true,
        },
        {
            name: 'React Hackathon',
            description: 'A React app built during the React 100 hackathon.',
            tech: ['React', 'JavaScript'],
            repo: `${GITHUB}/React100_Hackathon`,
            live: 'https://react100-hackathon-topaz.vercel.app',
            featured: true,
        },
        {
            name: 'Mortgage Calculator',
            description: 'Calculates monthly payments from loan amount, interest rate and term.',
            tech: ['React', 'JavaScript'],
            repo: `${GITHUB}/React100MortgageCalc`,
            live: 'https://react100-mortgage-calc.vercel.app',
            featured: true,
        },
        {
            name: 'Card Scanner',
            description: 'A multi-hobby trading card scanner.',
            tech: ['Python'],
            repo: `${GITHUB}/Card-Scanner`,
        },
        {
            name: 'Movie Finder',
            description: 'An Express API that looks up movie details and caches the results.',
            tech: ['Node', 'Express'],
            repo: `${GITHUB}/node101-movie-finder`,
        },
        {
            name: 'Tic Tac Toe',
            description: 'The classic game, built in React.',
            tech: ['React'],
            repo: `${GITHUB}/React100-TicTacToe`,
        },
        {
            name: 'San Diego Top Spots',
            description: 'Turns a JSON list of places into a table with Google Maps links using jQuery.',
            tech: ['jQuery', 'HTML'],
            repo: `${GITHUB}/SanDiegoTopSpots`,
        },
    ],
};
