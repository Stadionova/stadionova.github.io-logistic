import React, { useState } from "react";

import Map from "./Map";
import { Layers, TileLayer, VectorLayer } from "./Layers";
import { Style, Icon } from "ol/style";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { osm, vector } from "./Source";
import { fromLonLat } from "ol/proj";
import { Controls, FullScreenControl } from "./Controls";
import mapConfig from "./config.json";
import * as data from './deliveryItems.json';
import { EachItem } from "./Item/EachItem";

import cn from "./App.module.scss";

const addMarkers = (lonLatArray) => {
  const iconStyle = new Style({
    image: new Icon({
      anchorXUnits: "fraction",
      anchorYUnits: "pixels",
      src: mapConfig.markerImage32,
    }),
  });
  const features = lonLatArray.map((item) => {
    const feature = new Feature({
      geometry: new Point(fromLonLat(item)),
    });
    feature.setStyle(iconStyle);
    return feature;
  });
  return features;
}

//  [-94.9065, 38.9884],  [-94.6108, 38.846]

const App = () => {
  const listItems = data.items;
  const [showMarker, setShowMarker] = useState(false);
  const [features, setFeatures] = useState();

  const onAddCoordinatesOnMap = (a, b) => {
    const aNumX = a?.split(',')[0];
    const aNumY = a?.split(',')[1];
    const bNumX = b?.split(',')[0];
    const bNumY = b?.split(',')[1];
    setFeatures(addMarkers([[Number(aNumX), Number(aNumY)], [Number(bNumX), Number(bNumY)]]));
  }

  return (
    <div className={cn.deliveryPage}>
      <div className={cn.list}>
        {
          listItems.map((item, index) =>
            <EachItem
              onAddCoordinatesOnMap={onAddCoordinatesOnMap}
              indexItem={index + 1}
              pointA={item.pointA}
              pointB={item.pointB}
            />)
        }
      </div>
      <div>
        <Map center={fromLonLat(mapConfig.center)} zoom={9}>
          <Layers>
            <TileLayer source={osm()} zIndex={0} />
            {showMarker && <VectorLayer source={vector({ features })} />}
          </Layers>
          <Controls>
            <FullScreenControl />
          </Controls>
        </Map>
        <div className={cn.showCheckbox}>
          <input
            type="checkbox"
            checked={showMarker}
            onChange={(event) => setShowMarker(event.target.checked)}
          />
          Показать добавленные точки на карте
        </div>
      </div>
    </div>
  );
};

export default App;
