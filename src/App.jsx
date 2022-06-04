import logo from "./assets/logo.png";
import axios from "axios";
import { createRef, useState } from "react";
import { TileLayer, MapContainer, GeoJSON } from "react-leaflet";
import { geoJSON } from "leaflet";
import { getCoordinatesURI, getRoutesURI } from "./utils/API";
import style_app from "./styles/app.style";

// Used Modules react-leaflet, leaflet

function App() {
  // Start and Destination Ref for input
  const start = createRef();
  const destination = createRef();

  const [getJson, setGetJSON] = useState(false);
  const [getDistance, setDistance] = useState("-");

  const [getStart, setStart] = useState("-");
  const [getDest, setDest] = useState("-");

  let startCor;
  let destCor;

  async function triggerAPIs(_start, _destination) {
    // Get Start Coordinates
    await axios
      .get(getCoordinatesURI(_start))
      .then((res) => {
        const data = res.data;
        const features = data.features[0];
        const geometry = features.geometry;
        const coordinates = geometry.coordinates;

        startCor = coordinates;
      })
      // Get Desination Coordinates
      .then(async () => {
        await axios.get(getCoordinatesURI(_destination)).then((res) => {
          const data = res.data;
          const features = data.features[0];
          const geometry = features.geometry;
          const coordinates = geometry.coordinates;

          destCor = coordinates;
        });
      })
      // Get Routes from API
      .then(async () => {
        await axios.get(getRoutesURI(startCor, destCor)).then((res) => {
          const data = res.data;
          const feature_1 = data.features[0];
          const properties = feature_1.properties;
          const summary = properties.summary;
          const distance = summary.distance;

          setGetJSON(data);
          setStart(_start);
          setDest(_destination);
          changeDistance(distance);
        });
      })
      .catch((err) => {
        try {
          alert(err.response.data.error.message);
        } catch (e) {
          alert("Something went wrong 🙁");
        }
      });
  }

  const getLocation = async (e) => {
    e.preventDefault();
    const _start = start.current.value;
    const _destination = destination.current.value;
    // Resetting States
    setStart("-");
    setDest("-");
    setDistance("-");
    setGetJSON(false);
    // Calling API functions
    triggerAPIs(_start, _destination);
  };

  function changeDistance(distance) {
    setDistance(Math.round(distance / 1000).toLocaleString());
  }

  return (
    <div>
      <div className={style_app.nav_container}>
        <img src={logo} className="h-[69px]" alt="company logo"></img>
      </div>

      <div className={style_app.container}>
        <p className="py-[33px]">
          Let's calculate <b>distance</b> from Google maps
        </p>

        <div className="flex">
          <div className="w-[50vw] text-left">
            <div className="md:mx-auto mx-4 max-w-[65%]">
              <form className="flex justify-between" onSubmit={getLocation}>
                <div>
                  <p className="text-[#000000] mt-[38px] mb-3">Origin</p>
                  <input
                    type="text"
                    ref={start}
                    required
                    className={style_app.input_container}
                  ></input>

                  <p className="text-[#000000] mt-[48px] mb-3">Destination</p>
                  <input
                    type="text"
                    ref={destination}
                    required
                    className={style_app.input_container}
                  ></input>
                </div>

                <div className="h-full my-auto">
                  <button className={style_app.calculate}>Calculate</button>
                </div>
              </form>

              <div className={style_app.right_flex}>
                <div className="px-[26px] flex justify-between w-full">
                  <div className="py-7">Distance</div>

                  <div className={style_app.distance}>{getDistance} kms</div>
                </div>

                <div className={style_app.info_container}>
                  <div className="py-7 text-[14px]">
                    The distance between <b>{getStart}</b> and <b>{getDest}</b>{" "}
                    is <b>{getDistance} kms</b>.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[50vw]">
            {getJson && (
              <MapContainer
                bounds={geoJSON(getJson).getBounds()}
                className={"h-[60vh] m-[100px] bg-white"}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <GeoJSON data={getJson} />
              </MapContainer>
            )}
            {!getJson && (
              <MapContainer
                zoom="2"
                center={[0, 0]}
                className={"h-[60vh] m-[100px] bg-white"}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <GeoJSON data={getJson} />
              </MapContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
