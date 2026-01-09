import { createSignal } from 'solid-js';
import { Tray, TrayCard } from './components/Tray';
import './App.css';

function App() {
  const [count, setCount] = createSignal(0);
  let trayRef;

  // Demo backdrop content - simulating a map with scrollable content
  const BackdropContent = () => (
    <div class="backdrop-content">
      <div class="backdrop-header">
        <h1>Interactive Map Area</h1>
        <p>This content stays fixed behind the tray</p>
      </div>
      
      <div class="backdrop-actions">
        <button onClick={() => setCount(c => c + 1)}>
          Clicked {count()} times
        </button>
        <button onClick={() => trayRef?.scrollToPosition?.(2)}>
          Dock Tray
        </button>
        <button onClick={() => trayRef?.scrollToPosition?.(3)}>
          Open Tray
        </button>
        <button onClick={() => trayRef?.scrollToPosition?.(4)}>
          Expand Tray
        </button>
      </div>
      
      <div class="backdrop-grid">
        {Array.from({ length: 20 }, (_, i) => (
          <div class="backdrop-tile" onClick={() => alert(`Tile ${i + 1} clicked!`)}>
            <span>{i + 1}</span>
          </div>
        ))}
      </div>
      
      <div class="backdrop-section">
        <h2>More Interactive Content</h2>
        <p>This demonstrates that the backdrop remains fully interactive even when the tray is open.</p>
        <p>Try scrolling this area when the tray is docked - the backdrop has its own scroll.</p>
      </div>
      
      <div class="backdrop-grid">
        {Array.from({ length: 12 }, (_, i) => (
          <div class="backdrop-tile" onClick={() => alert(`Tile ${i + 21} clicked!`)}>
            <span>{i + 21}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // Demo card header
  const CardHeader = () => (
    <div class="card-header-content">
      <h2>San Francisco</h2>
      <p class="subtitle">California, United States</p>
    </div>
  );

  // Demo card content - lots of content to test scrolling
  const CardContent = () => (
    <div class="card-body">
      <section class="info-section">
        <h3>About</h3>
        <p>
          San Francisco, officially the City and County of San Francisco, 
          is a commercial, financial, and cultural center in Northern California.
        </p>
        <p>
          With a 2020 population of 873,965, it is the fourth most populous 
          city in California and the 17th most populous in the United States.
        </p>
      </section>

      <section class="info-section">
        <h3>Quick Facts</h3>
        <ul>
          <li>Population: ~870,000</li>
          <li>Area: 46.87 sq mi</li>
          <li>Elevation: 52 ft</li>
          <li>Founded: 1776</li>
          <li>Incorporated: 1850</li>
          <li>Time Zone: Pacific (UTC-8/-7)</li>
        </ul>
      </section>

      <section class="info-section">
        <h3>Neighborhoods</h3>
        <div class="tags">
          <span class="tag">Mission District</span>
          <span class="tag">Castro</span>
          <span class="tag">Haight-Ashbury</span>
          <span class="tag">North Beach</span>
          <span class="tag">Chinatown</span>
          <span class="tag">SOMA</span>
          <span class="tag">Marina</span>
          <span class="tag">Pacific Heights</span>
          <span class="tag">Nob Hill</span>
          <span class="tag">Russian Hill</span>
          <span class="tag">Financial District</span>
          <span class="tag">Tenderloin</span>
        </div>
      </section>

      <section class="info-section">
        <h3>Points of Interest</h3>
        <div class="poi-list">
          <div class="poi-item">
            <div class="poi-icon">🌉</div>
            <div class="poi-info">
              <strong>Golden Gate Bridge</strong>
              <span>Iconic suspension bridge spanning the Golden Gate strait</span>
            </div>
          </div>
          <div class="poi-item">
            <div class="poi-icon">🏝️</div>
            <div class="poi-info">
              <strong>Alcatraz Island</strong>
              <span>Historic federal penitentiary on an island in the bay</span>
            </div>
          </div>
          <div class="poi-item">
            <div class="poi-icon">🚋</div>
            <div class="poi-info">
              <strong>Cable Cars</strong>
              <span>Historic streetcar system and national historic landmark</span>
            </div>
          </div>
          <div class="poi-item">
            <div class="poi-icon">🌳</div>
            <div class="poi-info">
              <strong>Golden Gate Park</strong>
              <span>1,017-acre urban park with museums and gardens</span>
            </div>
          </div>
          <div class="poi-item">
            <div class="poi-icon">🦭</div>
            <div class="poi-info">
              <strong>Fisherman's Wharf</strong>
              <span>Waterfront neighborhood and popular tourist attraction</span>
            </div>
          </div>
          <div class="poi-item">
            <div class="poi-icon">🏛️</div>
            <div class="poi-info">
              <strong>Palace of Fine Arts</strong>
              <span>Monumental structure built for the 1915 Panama-Pacific Exposition</span>
            </div>
          </div>
          <div class="poi-item">
            <div class="poi-icon">🎨</div>
            <div class="poi-info">
              <strong>SFMOMA</strong>
              <span>San Francisco Museum of Modern Art</span>
            </div>
          </div>
          <div class="poi-item">
            <div class="poi-icon">🏟️</div>
            <div class="poi-info">
              <strong>Oracle Park</strong>
              <span>Home of the San Francisco Giants baseball team</span>
            </div>
          </div>
        </div>
      </section>

      <section class="info-section">
        <h3>Getting Around</h3>
        <p>
          San Francisco has an extensive public transit system including 
          BART (Bay Area Rapid Transit), Muni buses and light rail, 
          historic cable cars, and ferries.
        </p>
        <p>
          The city is known for being walkable, though its famous hills 
          can be challenging. Many residents also use rideshare services 
          and bicycles.
        </p>
      </section>

      <section class="info-section">
        <h3>Weather</h3>
        <p>
          Known for its fog, San Francisco has a mild climate year-round. 
          Summers are cool with frequent fog, while fall offers the warmest 
          and clearest weather. The famous quote "The coldest winter I ever 
          spent was a summer in San Francisco" captures the city's unique climate.
        </p>
      </section>

      <section class="info-section">
        <h3>History</h3>
        <p>
          Originally inhabited by the Ohlone people, San Francisco was 
          colonized by Spain in 1776. The California Gold Rush of 1849 
          brought rapid growth, transforming it into the largest city 
          on the West Coast.
        </p>
        <p>
          The 1906 earthquake and fire destroyed much of the city, but 
          it was quickly rebuilt. The city played a significant role in 
          World War II and later became a center of the counterculture 
          movement in the 1960s.
        </p>
        <p>
          Today, San Francisco is known for its tech industry, liberal 
          politics, diverse culture, and stunning natural beauty.
        </p>
      </section>

      <section class="info-section">
        <h3>Economy</h3>
        <p>
          San Francisco is a major financial hub and home to many tech 
          companies. The city's economy is driven by technology, tourism, 
          finance, and professional services.
        </p>
        <p>
          Notable companies headquartered in San Francisco include Salesforce, 
          Uber, Airbnb, Twitter (now X), and many venture capital firms.
        </p>
      </section>

      <section class="info-section">
        <h3>Culture</h3>
        <p>
          San Francisco is known for its diverse and vibrant culture. 
          The city has played a significant role in various cultural 
          movements, from the Beat Generation to the Summer of Love 
          to the LGBTQ+ rights movement.
        </p>
        <p>
          The city boasts world-class museums, theaters, and music venues, 
          as well as a thriving food scene that reflects its multicultural 
          population.
        </p>
      </section>

      <div class="spacer" />
    </div>
  );

  return (
    <Tray 
      ref={(ref) => trayRef = ref}
      backdrop={<BackdropContent />}
    >
      <TrayCard 
        header={<CardHeader />}
        onHandleClick={() => trayRef?.cyclePosition?.()}
      >
        <CardContent />
      </TrayCard>
    </Tray>
  );
}

export default App;
