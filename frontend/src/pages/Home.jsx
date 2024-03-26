import Earth from "./Earth";

const Home = () => {
  return (
    <div className="page">
      <div className="container">
        <div className="hero">
          <h1>
            Visualize the <span className="catchy">world</span> like never
            before
          </h1>
        </div>
        <div className="right-div">
          <Earth />
        </div>
      </div>
      <div className=" bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-white mb-8">
          The Power of Location: Unveiling Insights with Geospatial Data
          Analysis
        </h1>

        {/* About Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">
            What is Geospatial Data Analysis?
          </h2>
          <p className="text-lg text-gray-200">
            Geospatial data analysis, also known as geospatial visualization, is
            the art and science of representing data that has a geographic
            component. This data can range from point locations (like stores or
            accidents) to areas (like city boundaries or ecological zones) or
            even 3D data (like terrain or building heights). By visualizing this
            data on maps and other geographic contexts, we gain deeper insights
            into patterns, relationships, and trends.
          </p>
        </section>

        {/* Benefits Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Benefits of Geospatial Data Analysis
          </h2>
          <ul className="list-disc space-y-2 text-lg text-gray-200">
            <p>Improved decision-making through location-based insights.</p>
            <p>
              Identification of trends and patterns not readily apparent in
              traditional data analysis.
            </p>
            <p>
              Enhanced communication and storytelling through visually
              compelling maps and graphics.
            </p>
            <p>
              Increased efficiency and resource allocation by understanding
              spatial relationships.
            </p>
          </ul>
        </section>

        {/* Use Cases Section */}
        <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Urban Planning
            </h3>
            <p className="text-base text-gray-600">
              Optimize infrastructure placement, identify areas for development,
              and analyze traffic patterns.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Public Health
            </h3>
            <p className="text-base text-gray-600">
              Track disease outbreaks, identify high-risk areas, and allocate
              resources effectively.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 md:hidden">
            {/* More use cases can be added here for smaller screens */}
          </div>
        </section>

        {/* Types of Visualization Techniques */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Types of Geospatial Visualization Techniques
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center space-y-2">
              <img
                src="../../src/assets/images/point_map.png"
                className="w-8 h-8 rounded-full"
              />
              <p className="text-lg text-gray-200">Point Maps</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <img
                src="../../src/assets/images/heatmap.png"
                className="w-8 h-8 rounded-full"
              />
              <p className="text-lg text-gray-200">Heatmaps</p>
            </div>
            <div className="flex flex-col items-center space-y-2 ">
              <img
                src="../../src/assets/images/3dicon.png"
                className="w-8 h-8 rounded-full"
              />
              <p className="text-lg text-gray-200">3D Models</p>
            </div>
          </div>
        </section>

        {/* Tools and Technologies Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Tools and Technologies
          </h2>
          <p className="text-lg text-gray-200">
            Several powerful tools and technologies facilitate geospatial data
            analysis. Here are a few examples:
          </p>
          <ul className="list-disc space-y-2 text-lg text-gray-200">
            <p>Geographic Information Systems (GIS): ArcGIS, QGIS</p>
            <p>
              Web-based Mapping Platforms: Mymapindia, Mapbox, openstreetmap
            </p>
            <p>
              Data Analysis Libraries: GeoPandas (Python), Leaflet (JavaScript),
              Turf.js
            </p>
            <p>
              Visualization Tools: Tableau, Power BI (with spatial capabilities)
            </p>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Home;
