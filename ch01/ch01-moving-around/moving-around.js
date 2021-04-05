/**
 * Chapter 1
 * Moving around the map view
 *
 * Peter J Langley
 * http://www.codechewing.com
 */
var map = new ol.Map({
    layers: [
        new ol.layer.Tile({
            source: new ol.source.Stamen({
                layer: 'watercolor'
            })
        })
    ],
    target: 'js-map',
    view: new ol.View({
        zoom: 6,
        center: ol.proj.fromLonLat([12.5, 41.9]) //맵의 디폴트값은 EPSG3857,  경도위도 프로젝션은 EPSG4326 이어서 변환이 필요하다.
    })
});

// DOM 요소를 활용하기 위한 변수
var citySelect = document.getElementById('js-city');
var zoomInput = document.getElementById('js-zoom');
var rotateInput = document.getElementById('js-rotate');
var lonInput = document.getElementById('js-lon');
var latInput = document.getElementById('js-lat');

// map view 이벤트리스너
var updateUI = function(event) {
    var view = event && event.currentTarget || map.getView();
    zoomInput.value = view.getZoom(); //위의 돔 요소에 밸류값 부여 현재 맵의 get~ 함수 사용
    rotateInput.value = view.getRotation();

    var centerLonLat = ol.proj.toLonLat(view.getCenter());
    lonInput.value = centerLonLat[0].toFixed(3);
    latInput.value = centerLonLat[1].toFixed(3);
};
updateUI();

// ol.view 클래스에는 뷰에서 특정 이벤트를 읽고 이벤트 핸들러를 지정할 수 있는 on 메서드가 있음.
map.getView().on([
    //center, resolution, rotation 이 변화할때마다 updateUI 함수 구동.
    'change:center',
    'change:resolution',
    'change:rotation'
], updateUI);

// 맵 뷰 센터 설정
var setCenter = function(lon, lat) {
    map.getView().setCenter(ol.proj.fromLonLat([
        parseFloat(lon), parseFloat(lat)
    ]));
};

//인풋필드 값을 통해 맵view 업데이트 이벤트리스너
window.addEventListener('keyup', function(event) {
    switch(event.target.id) {
        case 'js-zoom':
            //렌더링 되기 전에 resolution 값 설정
            map.beforeRender(ol.animation.zoom({
                resolution: map.getView().getResolution(),
                duration: 150
            }));
            map.getView().setZoom(parseInt(event.target.value, 10));
            break;

        case 'js-rotate':
            //렌더링 되기전에 rotation 값 설정
            map.beforeRender(ol.animation.rotate({
                rotation: map.getView().getRotation(),
                duration: 250
            }));
            map.getView().setRotation(parseFloat(event.target.value));
            break;

        case 'js-lon':
            setCenter(event.target.value, latInput.value);
            break;

        case 'js-lat':
            setCenter(lonInput.value, event.target.value);
            break;
    }
});


//도시선택 이벤트리스너
citySelect.addEventListener('change', function() {
    map.beforeRender(ol.animation.pan({
        source: map.getView().getCenter(),
        duration: 500
    }));
    setCenter.apply(null, this.value.split(','));
});