// بيانات المباني التجريبية - GeoJSON
export const buildingsGeoJSON = {
  "type": "FeatureCollection",
  "features": [
    // الرياض
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [46.6753, 24.7136] },
      "properties": { "id": "RYD-001", "name": "مبنى الحمراء 1", "use": "residential", "height": 15, "city": "الرياض", "district": "الحمراء" }
    },
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [46.6743, 24.7126] },
      "properties": { "id": "RYD-002", "name": "مبنى الحمراء 2", "use": "commercial", "height": 20, "city": "الرياض", "district": "الحمراء" }
    },
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [46.6763, 24.7146] },
      "properties": { "id": "RYD-003", "name": "مبنى الحمراء 3", "use": "residential", "height": 12, "city": "الرياض", "district": "الحمراء" }
    },
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [46.7219, 24.7743] },
      "properties": { "id": "RYD-004", "name": "مبنى الملقا 1", "use": "residential", "height": 18, "city": "الرياض", "district": "الملقا" }
    },
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [46.7229, 24.7753] },
      "properties": { "id": "RYD-005", "name": "مبنى الملقا 2", "use": "commercial", "height": 25, "city": "الرياض", "district": "الملقا" }
    },
    // جدة
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [39.1925, 21.4858] },
      "properties": { "id": "JED-001", "name": "مبنى الروضة 1", "use": "residential", "height": 18, "city": "جدة", "district": "الروضة" }
    },
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [39.1935, 21.4868] },
      "properties": { "id": "JED-002", "name": "مبنى الروضة 2", "use": "commercial", "height": 25, "city": "جدة", "district": "الروضة" }
    },
    // الدمام
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [50.2084, 26.3927] },
      "properties": { "id": "DMM-001", "name": "مبنى الدمام 1", "use": "residential", "height": 16, "city": "الدمام", "district": "الفيصلية" }
    },
    // مكة
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [39.8262, 21.3891] },
      "properties": { "id": "MKK-001", "name": "مبنى مكة 1", "use": "residential", "height": 20, "city": "مكة", "district": "العزيزية" }
    }
  ]
};

export const postalCodesGeoJSON = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [46.6753, 24.7136] },
      "properties": { "postalCode": "11564", "city": "الرياض", "district": "الحمراء", "region": "الرياض" }
    },
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [46.7219, 24.7743] },
      "properties": { "postalCode": "13521", "city": "الرياض", "district": "الملقا", "region": "الرياض" }
    },
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [39.1925, 21.4858] },
      "properties": { "postalCode": "23235", "city": "جدة", "district": "الروضة", "region": "مكة المكرمة" }
    }
  ]
};
