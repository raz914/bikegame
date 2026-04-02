export const STAGES = [
    {
        id: 'highway',
        name: 'Highway',
        description: 'Open road, golden sunset',
        thumbnail: '/images/stage-highway.png',
        thumbnailGradient: 'linear-gradient(135deg, #f4b36f 0%, #ef7f42 48%, #4e4f78 100%)',
        locked: false,
    },
    {
        id: 'city',
        name: 'City Streets',
        description: 'Neon-lit urban jungle',
        thumbnail: '/images/stage-city.png',
        thumbnailGradient: 'linear-gradient(135deg, #2e315d 0%, #3a5bdc 46%, #1ce1ff 100%)',
        locked: false,
    },
    {
        id: 'desert',
        name: 'Desert Run',
        description: 'Blazing heat, endless sand',
        thumbnail: '/images/stage-desert.png',
        thumbnailGradient: 'linear-gradient(135deg, #e2c07b 0%, #cf8e45 52%, #8d5937 100%)',
        locked: false,
    },
    {
        id: 'night',
        name: 'Night Track',
        description: 'Moonlit sprint under city glow',
        thumbnail: '',
        thumbnailGradient: 'linear-gradient(135deg, #030712 0%, #13203f 50%, #2b5cff 100%)',
        locked: false,
    },
    {
        id: 'jungle',
        name: 'Jungle Run',
        description: 'Dense canopy, humid green tunnel',
        thumbnail: '',
        thumbnailGradient: 'linear-gradient(135deg, #19351f 0%, #255c2f 45%, #8fcf58 100%)',
        locked: false,
    },
]

export const RIDERS = [
    {
        id: 'johnny',
        name: 'Johnny',
        style: 'Street',
        thumbnail: '/images/rider-johnny.png',
        locked: false,
    },
    {
        id: 'maria',
        name: 'Maria',
        style: 'Racer',
        thumbnail: '/images/rider-maria.png',
        locked: true,
    },
]

export const BIKES = [
    {
        id: 'street110',
        name: 'Street 110',
        specs: '2024 · 8 HP · 1 Cylinder',
        thumbnail: '/images/bike-street.png',
        locked: false,
    },
    {
        id: 'sport250',
        name: 'Sport 250',
        specs: '2024 · 25 HP · 2 Cylinder',
        thumbnail: '/images/bike-sport.png',
        locked: true,
    },
]
