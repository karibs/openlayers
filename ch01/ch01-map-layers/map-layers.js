/**
 * Chapter 1
 * Managing map's stack layers
 *
 * Peter J Langley
 * http://www.codechewing.com
 */


var map = new ol.Map({
    layers: [
        new ol.layer.Tile({
            //
            source: new ol.source.MapQuest({
                layer: 'sat' // satellite 요청
            }),
            opacity: 0.5,
            zIndex: 1 // 1로 설정한 이유는 이 레이어 위에 추가된 레이어 그룹에 의해 이 레이어가 숨겨지지 않도록 하기 위한 것.
        })
    ],
    view: new ol.View({
        zoom: 4,
        center: [2120000, 0]
    }),
    target: 'js-map'
});

// 추가될 레이어들을 그룹으로 묶어둔다.
var layerGroup = new ol.layer.Group({
    layers: [
        new ol.layer.Tile({
            source: new ol.source.MapQuest({
                layer: 'osm'
            }),
            title: 'MapQuest OSM'
        }),
        new ol.layer.Tile({
            source: new ol.source.MapQuest({
                layer: 'hyb'
            }),
            title: 'MapQuest Hybrid', //title 정보는 레이어 스위칭 로직에 사용, UI 텍스트에 표시될 이름으로 사용
            visible: false //페이지 로딩을 할 떄, osm 레이어만 보여지게끔 visible은 false
        }),
        new ol.layer.Tile({
            source: new ol.source.OSM(),
            title: 'OpenStreetMap',
            visible: false
        })
    ],
    zIndex: 0 //렌더링 되면 숨겨진다.

    //내부적으로 오픈레이어스는 레이어를 배열에 저장하고 배열에 저장된 것과 동일한 순서로 렌더링한다.
    //따라서, 첫 번째 요소는 하단 레이어!
    //지도는 레이어를 스택에 저장하는 것으로 생각할 수 있으며 아래에서 위로 렌더링되므로
    //불투명도와 범위에 따라 위 레이어가 아래 레이어 아래에 숨길 수 있다.
});

// 맵 인스턴스에 레이어그룹 등록
map.addLayer(layerGroup);
//변수 앞에 달러 기호를 붙이는 것은 결과를 jquery 객체로 나타내는 규칙
var $layersList = $('#js-layers');

// 페널에 레이어 목록을 동적으로 채우기
//index는 반복시 레이어의 위치
//array는 반복시 레이어 그룹
layerGroup.getLayers().forEach(function(element, index, array) {
    var $li = $('<li />'); // li 요소를 만들어서 요소 추가할 것임
    $li.text(element.get('title')); //layerGroup에서 title 요소 가져옴
    $layersList.append($li);
});

//목록의 항목이 이동되면 업데이트 이벤트가 발생
//탑레이어의 비저블을 visible 세팅.
$layersList.sortable({
    update: function() {
        var topLayer = $layersList.find('li:first-child').text();

        layerGroup.getLayers().forEach(function(element) {
            element.setVisible(element.get('title') === topLayer);
        });
    }
});