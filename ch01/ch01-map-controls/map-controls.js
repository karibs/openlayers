/**
 * Chapter 1
 * Managing map's controls
 *
 * Peter J Langley
 * http://www.codechewing.com
 */
var map = new ol.Map({
    layers: [
        new ol.layer.Tile({
            source: new ol.source.MapQuest({
                layer: 'osm'
            })
        })
    ],
    view: new ol.View({
        center: [12930000, -78000],
        zoom: 3
    }),
    target: 'js-map',
    controls: [] //컨트롤은 빈어레이로 선언. 아래 로직에서 사용할 컨트롤 등록.
});

var zoomControl = new ol.control.Zoom({
    zoomInTipLabel: 'Zoom closer in', //줌아이콘의 이름 등록
    zoomOutTipLabel: 'Zoom further out',
    className: 'ol-zoom custom-zoom-control'
});

var attributionControl = new ol.control.Attribution({
    collapsible: false,
    collapsed: false
});

// rotation 값이 0보다 클 때 초기화 버튼
var rotateControl = new ol.control.Rotate({
    autoHide: false
});

map.addControl(zoomControl);
map.addControl(attributionControl);
map.addControl(rotateControl);

//클릭시 이벤트 발생 로직 -> 컨트롤 등록 여부 로직
$('#js-controls').on('change', function(event) {
    var target = $(event.target);
    var control = target.val(); //밸류 이름과 위의 변수이름이 같아야 한다.

    if (target.prop('checked')) { //타겟 요소 프라퍼티가 checked일 때 등록, non-checked 일때는 등록삭제
        map.addControl(window[control]);
    } else {
        map.removeControl(window[control]);
    }
});