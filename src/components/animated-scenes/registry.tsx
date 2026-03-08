import { memo } from 'react';
import {
  WindowDeskScene, InteriorScene, OpenViewScene,
  DeskLamp, CoffeeCup, BookStack, CandleItem, PlantPot, Monitor, Bookshelf,
  RainOnGlass, CityLightsView, ForestView, SnowFallView, OceanWaveView,
  StarFieldView, CloudDriftView, AuroraBandsView, DustMotesView,
  CampfireGlowView, BubbleRiseView, MountainView, BambooGardenView,
  GreenCanopyView, CloudScapeView,
} from './parts';

/* 1 */ const RainyCafe = memo(() => (
  <WindowDeskScene wallColor="#2d1b0e" deskColor="#4a3020" deskHighlight="#6a4a30" frameColor="#5a4a3a" divider windowView={<RainOnGlass />}>
    <DeskLamp x={78} />
    <CoffeeCup x={60} />
    <BookStack x={18} />
  </WindowDeskScene>
));

/* 2 */ const CozyLibrary = memo(() => (
  <InteriorScene wallColor="#1c1410" deskColor="#3d2b1f" deskHighlight="#5a4030"
    ambientContent={<><Bookshelf x={5} w={22} /><Bookshelf x={73} w={22} /><DustMotesView warm /></>}>
    <CandleItem x={70} />
    <BookStack x={20} colors={['#6a3a1a', '#2e3a4e', '#4a2020']} />
    <DeskLamp x={82} glowColor="#ffcc88" />
  </InteriorScene>
));

/* 3 */ const NightCity = memo(() => (
  <WindowDeskScene wallColor="#0a0a1a" deskColor="#1a1a2e" deskHighlight="#2a2a3e" frameColor="#3a3a4a" windowView={<CityLightsView />}>
    <Monitor x={38} />
    <CoffeeCup x={65} />
    <PlantPot x={18} />
  </WindowDeskScene>
));

/* 4 */ const ForestCabin = memo(() => (
  <WindowDeskScene wallColor="#0d1a0d" deskColor="#3a2a18" deskHighlight="#5a4028" frameColor="#4a3a28" divider windowView={<ForestView />}>
    <DeskLamp x={78} glowColor="#ffe0a0" />
    <BookStack x={20} colors={['#5a3a1a', '#2a4a2a', '#3a2a1a']} />
    <CoffeeCup x={58} />
  </WindowDeskScene>
));

/* 5 */ const RainyBedroom = memo(() => (
  <WindowDeskScene wallColor="#1a1520" deskColor="#2a2030" deskHighlight="#3a3040" frameColor="#4a3a4a" windowView={<RainOnGlass skyColor="#1a1530" />}>
    <DeskLamp x={80} glowColor="#e0c0ff" />
    <PlantPot x={20} />
    <BookStack x={60} colors={['#4a2e4a', '#2e2e4a', '#3a2a3a']} />
  </WindowDeskScene>
));

/* 6 */ const LofiBedroom = memo(() => (
  <InteriorScene wallColor="#1a0a2e" deskColor="#2a1a3e" deskHighlight="#3a2a4e"
    ambientContent={<>
      <div className="absolute top-[8%] left-[10%] w-[35%] h-[45%] rounded-sm" style={{ background: '#0d0a18', border: '3px solid #2a1a3a' }}>
        <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #1a0a30, #2a1040)', animation: 'scene-screen 4s ease-in-out infinite' }} />
      </div>
      <div className="absolute top-[5%] right-[10%] w-[20%] h-[30%] rounded-sm" style={{ background: 'linear-gradient(180deg, rgba(120,0,200,0.06), rgba(200,0,150,0.04))', animation: 'scene-neon 3s ease-in-out infinite' }} />
      <DustMotesView warm={false} />
    </>}>
    <Monitor x={38} screenColor="#1a0a30" />
    <PlantPot x={75} />
  </InteriorScene>
));

/* 7 */ const MountainCabin = memo(() => (
  <WindowDeskScene wallColor="#1a2030" deskColor="#3a2a1a" deskHighlight="#5a4028" frameColor="#4a3a2a" divider windowView={<MountainView />}>
    <DeskLamp x={78} />
    <CoffeeCup x={55} />
    <BookStack x={18} />
  </WindowDeskScene>
));

/* 8 */ const ZenGarden = memo(() => (
  <WindowDeskScene wallColor="#0a1a0f" deskColor="#2a2018" deskHighlight="#3a3020" frameColor="#3a3020" windowView={<BambooGardenView />}>
    <PlantPot x={75} />
    <CoffeeCup x={55} />
    <BookStack x={18} colors={['#4a3a2a', '#2a3a2a', '#3a2a1a']} />
  </WindowDeskScene>
));

/* 9 */ const DarkAcademia = memo(() => (
  <InteriorScene wallColor="#1a1008" deskColor="#2e1f0a" deskHighlight="#4a3018"
    ambientContent={<><Bookshelf x={3} w={25} shelfColor="#3a2a18" /><Bookshelf x={72} w={25} shelfColor="#3a2a18" /><DustMotesView warm /></>}>
    <CandleItem x={45} />
    <CandleItem x={72} />
    <BookStack x={20} colors={['#5a2a10', '#2a1a08', '#4a3020']} />
    <DeskLamp x={82} glowColor="#ffcc88" />
  </InteriorScene>
));

/* 10 */ const VintageStudy = memo(() => (
  <InteriorScene wallColor="#1a1510" deskColor="#2e2518" deskHighlight="#4a3a28"
    ambientContent={<><Bookshelf x={70} w={26} rows={3} shelfColor="#4a3a28" /><DustMotesView warm /></>}>
    <DeskLamp x={25} glowColor="#ffe0a0" />
    <BookStack x={55} colors={['#6a4020', '#3a2a1a', '#5a3010']} />
    <CoffeeCup x={78} />
  </InteriorScene>
));

/* 11 */ const SpaceStation = memo(() => (
  <WindowDeskScene wallColor="#060610" deskColor="#1a1a2a" deskHighlight="#2a2a3a" frameColor="#3a3a4a" roundWindow windowView={<StarFieldView shootingStars />}>
    <Monitor x={35} screenColor="#0a0a20" />
    <CoffeeCup x={65} />
  </WindowDeskScene>
));

/* 12 */ const OceanCliff = memo(() => (
  <OpenViewScene surfaceColor="#3a3028" surfaceHighlight="#4a4030" railingColor="#5a4a3a" viewContent={<OceanWaveView />}>
    <DeskLamp x={78} />
    <BookStack x={18} />
    <CoffeeCup x={55} />
  </OpenViewScene>
));

/* 13 */ const SunsetBalcony = memo(() => (
  <OpenViewScene surfaceColor="#3a2a1a" surfaceHighlight="#4a3a28" railingColor="#5a4a38" viewContent={<CloudDriftView sunset />}>
    <PlantPot x={80} />
    <CoffeeCup x={55} />
    <BookStack x={18} />
  </OpenViewScene>
));

/* 14 */ const WinterCabin = memo(() => (
  <WindowDeskScene wallColor="#1a2030" deskColor="#3a2a1a" deskHighlight="#5a4028" frameColor="#5a4a3a" divider windowView={<SnowFallView />}>
    <CandleItem x={72} />
    <CoffeeCup x={55} />
    <BookStack x={18} colors={['#4a2a2a', '#2a3a4a', '#3a2a1a']} />
  </WindowDeskScene>
));

/* 15 */ const AutumnForest = memo(() => (
  <WindowDeskScene wallColor="#1a1508" deskColor="#3a2a15" deskHighlight="#5a4020" frameColor="#4a3a28" divider windowView={<ForestView autumn />}>
    <DeskLamp x={78} glowColor="#ffcc88" />
    <CoffeeCup x={55} />
    <BookStack x={18} colors={['#6a3a10', '#4a2a08', '#5a3518']} />
  </WindowDeskScene>
));

/* 16 */ const LakeHouse = memo(() => (
  <WindowDeskScene wallColor="#0a1520" deskColor="#2a2018" deskHighlight="#3a3028" frameColor="#3a3a3a" windowView={
    <>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #1a2a3a, #0a1a28)' }} />
      {[0, 1, 2].map(i => (
        <div key={i} className="absolute rounded-full" style={{
          left: '-20%', top: `${15 + i * 18}%`, width: `${90 + i * 20}px`, height: `${15 + i * 5}px`,
          background: 'rgba(200,210,230,0.05)', filter: 'blur(8px)',
          animation: `scene-cloud ${22 + i * 6}s linear ${i * 4}s infinite`,
        }} />
      ))}
      <div className="absolute bottom-0 left-0 right-0 h-[35%]" style={{
        background: 'linear-gradient(0deg, rgba(20,40,60,0.4), transparent)',
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} className="absolute left-0 right-0" style={{
            top: `${30 + i * 20}%`, height: '1px',
            background: 'rgba(150,180,210,0.1)',
            animation: `scene-wave ${3 + i}s ease-in-out ${i * 0.4}s infinite`,
          }} />
        ))}
      </div>
    </>
  }>
    <DeskLamp x={78} />
    <CoffeeCup x={55} />
    <BookStack x={18} />
  </WindowDeskScene>
));

/* 17 */ const UndergroundLibrary = memo(() => (
  <InteriorScene wallColor="#0d0a08" deskColor="#1a1510" deskHighlight="#2a2018"
    ambientContent={<><Bookshelf x={2} w={20} rows={5} shelfColor="#2a1a10" /><Bookshelf x={78} w={20} rows={5} shelfColor="#2a1a10" /></>}>
    <CandleItem x={35} />
    <CandleItem x={65} />
    <BookStack x={18} colors={['#3a2a1a', '#2a1a08', '#4a3020']} />
    <BookStack x={75} colors={['#2a2a1a', '#3a1a10', '#2a2018']} />
  </InteriorScene>
));

/* 18 */ const MedievalStudy = memo(() => (
  <InteriorScene wallColor="#1a1008" deskColor="#2a1a0d" deskHighlight="#3a2a18"
    ambientContent={<>
      {/* Stone wall texture */}
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="absolute" style={{
          left: `${i * 18}%`, top: `${5 + (i % 3) * 15}%`,
          width: '15%', height: '8%', borderRadius: '2px',
          background: `rgba(60,50,35,${0.15 + (i % 3) * 0.05})`,
        }} />
      ))}
      <Bookshelf x={72} w={24} rows={3} shelfColor="#3a2a15" />
    </>}>
    <CandleItem x={30} />
    <CandleItem x={70} />
    <BookStack x={50} colors={['#5a3a18', '#3a2a10', '#4a2a08']} />
  </InteriorScene>
));

/* 19 */ const CyberpunkCity = memo(() => (
  <WindowDeskScene wallColor="#0a0a20" deskColor="#1a1a30" deskHighlight="#2a2040" frameColor="#3a2a4a" windowView={<CityLightsView neon />}>
    <Monitor x={35} screenColor="#0a0a20" />
    <CoffeeCup x={68} />
  </WindowDeskScene>
));

/* 20 */ const MuseumStudy = memo(() => (
  <InteriorScene wallColor="#141210" deskColor="#201e1a" deskHighlight="#302e28"
    ambientContent={<>
      {/* Picture frames */}
      {[0, 1, 2].map(i => (
        <div key={i} className="absolute" style={{
          left: `${15 + i * 28}%`, top: '10%', width: '18%', height: '30%',
          border: '3px solid #3a3530', background: `hsl(${20 + i * 40} 20% 12%)`,
        }} />
      ))}
      <DustMotesView warm />
    </>}>
    <DeskLamp x={78} />
    <BookStack x={18} colors={['#4a3a2a', '#2e2e2e', '#3a2a20']} />
  </InteriorScene>
));

/* 21 */ const Treehouse = memo(() => (
  <OpenViewScene surfaceColor="#3a2a18" surfaceHighlight="#4a3a20" railingColor="#5a4a30" viewContent={
    <>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #1a3020, #0a2010)' }} />
      {/* Canopy */}
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="absolute rounded-full" style={{
          left: `${i * 13 - 5}%`, top: `${-5 + (i % 3) * 10}%`,
          width: `${30 + i * 5}%`, height: `${25 + i * 3}%`,
          background: `hsl(${120 + i * 5} ${30 + i * 3}% ${10 + i * 2}%)`,
          animation: `scene-sway ${5 + i * 0.8}s ease-in-out ${i * 0.4}s infinite`,
        }} />
      ))}
      {[0, 1].map(i => (
        <div key={`ray-${i}`} className="absolute" style={{
          left: `${25 + i * 30}%`, top: 0, width: '40px', height: '100%',
          background: 'rgba(255,255,200,0.04)', transform: `rotate(${10 + i * 8}deg)`,
          filter: 'blur(12px)', animation: `scene-ray ${8 + i * 3}s ease-in-out infinite alternate`,
        }} />
      ))}
    </>
  }>
    <DeskLamp x={78} glowColor="#ffe0a0" />
    <BookStack x={18} />
  </OpenViewScene>
));

/* 22 */ const DesertCamp = memo(() => (
  <OpenViewScene surfaceColor="#2a2010" surfaceHighlight="#3a3018" viewContent={<CampfireGlowView />}>
    <BookStack x={18} colors={['#5a4020', '#3a2a10', '#4a3018']} />
    <CoffeeCup x={65} />
  </OpenViewScene>
));

/* 23 */ const MinimalistWhite = memo(() => (
  <InteriorScene wallColor="#1a1a20" deskColor="#24242a" deskHighlight="#2e2e34"
    ambientContent={<>
      <DustMotesView warm={false} />
      {/* Clean window */}
      <div className="absolute top-[8%] right-[8%] w-[30%] h-[50%] rounded-sm" style={{
        background: 'linear-gradient(180deg, rgba(200,210,230,0.06), rgba(200,210,230,0.02))',
        border: '2px solid rgba(200,210,230,0.08)',
      }} />
    </>}>
    <Monitor x={35} screenColor="#18181e" />
    <PlantPot x={75} />
    <CoffeeCup x={60} />
  </InteriorScene>
));

/* 24 */ const Greenhouse = memo(() => (
  <InteriorScene wallColor="#0a1a10" deskColor="#1a2a18" deskHighlight="#2a3a25"
    ambientContent={<GreenCanopyView />}>
    <PlantPot x={18} />
    <PlantPot x={75} />
    <BookStack x={45} colors={['#2a4a2a', '#3a5a3a', '#1a3a1a']} />
    <CoffeeCup x={60} />
  </InteriorScene>
));

/* 25 */ const FloatingIsland = memo(() => (
  <OpenViewScene surfaceColor="#2a3020" surfaceHighlight="#3a4030" viewContent={<CloudScapeView />}>
    <PlantPot x={80} />
    <BookStack x={18} />
    <DeskLamp x={60} />
  </OpenViewScene>
));

/* 26 */ const ArtStudio = memo(() => (
  <InteriorScene wallColor="#1a1210" deskColor="#2a1e18" deskHighlight="#3a2e25"
    ambientContent={<>
      {/* Canvases on wall */}
      {[0, 1].map(i => (
        <div key={i} className="absolute" style={{
          left: `${10 + i * 45}%`, top: '8%', width: '22%', height: '35%',
          background: `hsl(${i * 180 + 20} 30% 15%)`, border: '2px solid #3a2a1a',
        }} />
      ))}
      <DustMotesView warm />
    </>}>
    <DeskLamp x={78} glowColor="#ffe0a0" />
    <CoffeeCup x={55} />
    <BookStack x={18} colors={['#4a2a2a', '#2a2a4a', '#4a4a2a']} />
  </InteriorScene>
));

/* 27 */ const NordicCabin = memo(() => (
  <WindowDeskScene wallColor="#0a1020" deskColor="#2a2018" deskHighlight="#3a3028" frameColor="#3a3530" windowView={<AuroraBandsView />}>
    <CandleItem x={70} />
    <CoffeeCup x={55} />
    <BookStack x={18} colors={['#3a3028', '#2a2a3a', '#4a3a28']} />
  </WindowDeskScene>
));

/* 28 */ const VictorianLibrary = memo(() => (
  <InteriorScene wallColor="#18100a" deskColor="#2a1e10" deskHighlight="#3a2e1a"
    ambientContent={<><Bookshelf x={2} w={22} rows={5} shelfColor="#3a2a18" /><Bookshelf x={76} w={22} rows={5} shelfColor="#3a2a18" /><DustMotesView warm /></>}>
    <CandleItem x={35} />
    <DeskLamp x={78} glowColor="#ffcc88" />
    <BookStack x={50} colors={['#6a3a18', '#2a1a08', '#5a2a10']} />
  </InteriorScene>
));

/* 29 */ const Submarine = memo(() => (
  <WindowDeskScene wallColor="#0a1018" deskColor="#1a2028" deskHighlight="#2a3038" frameColor="#3a4048" roundWindow windowView={<BubbleRiseView />}>
    <Monitor x={35} screenColor="#0a1018" />
    <CoffeeCup x={68} />
  </WindowDeskScene>
));

/* 30 */ const SkyDeck = memo(() => (
  <OpenViewScene surfaceColor="#2a2a3a" surfaceHighlight="#3a3a4a" railingColor="#4a4a5a" viewContent={<CloudScapeView />}>
    <DeskLamp x={78} />
    <CoffeeCup x={55} />
    <BookStack x={18} />
  </OpenViewScene>
));

export const SCENE_REGISTRY: Record<string, React.ComponentType> = {
  'rainy-cafe': RainyCafe,
  'cozy-library': CozyLibrary,
  'night-city': NightCity,
  'forest-cabin': ForestCabin,
  'rainy-bedroom': RainyBedroom,
  'lofi-bedroom': LofiBedroom,
  'mountain-cabin': MountainCabin,
  'zen-garden': ZenGarden,
  'dark-academia': DarkAcademia,
  'vintage-study': VintageStudy,
  'space-station': SpaceStation,
  'ocean-cliff': OceanCliff,
  'sunset-balcony': SunsetBalcony,
  'winter-cabin': WinterCabin,
  'autumn-forest': AutumnForest,
  'lake-house': LakeHouse,
  'underground-library': UndergroundLibrary,
  'medieval-study': MedievalStudy,
  'cyberpunk-city': CyberpunkCity,
  'museum-study': MuseumStudy,
  'treehouse': Treehouse,
  'desert-camp': DesertCamp,
  'minimalist-white': MinimalistWhite,
  'greenhouse': Greenhouse,
  'floating-island': FloatingIsland,
  'art-studio': ArtStudio,
  'nordic-cabin': NordicCabin,
  'victorian-library': VictorianLibrary,
  'submarine': Submarine,
  'sky-deck': SkyDeck,
};
