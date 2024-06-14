var View = require('../../../core/view');
var _ = require('underscore');
var $ = require('jquery');

var template = `
<div class='search2'>
    <div class='input-wrapper'>
      <div class='search-icon'>
        <img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABwUlEQVR42sXWvyuEcRzA8edJMrhEl4GsUpSNJDFIyqCLZDEwWCRMN1yILAZ/geHssimbbpGkRGFhuMKgJLmewXVdX+8Bw6fn6fvjeTrDq2647+f77vne89zjKaX+1d+HxYsbUxls/VhEIzwHxgE+JnGINyjhC6dYQlPSAWO4hTL0gVX4cQN87KIK5aCAFtcAH3nNBiW8a77zgLRLwCZUiCssoAPejxQmcBRxtc5QbxPQHzKojGWDcx3CM5SwbhNQCNk8A89QO4piRoBWk4A+KCEHz1IfKmLOlknAnlhUFOdn40DMujMJuBSLNuA5Cb+aaV1AIBYMxwjw8SnmDeoClNAOL4Z7MW/GNqAj4YBpXUAp4SMIbI/gXCzYiREw6PIj3BULntCQ0G14bXIb9kIJ2w6bD4U8zrOuj+Iqpiw278RLyDtCs2lAL8piQAU51Gk2H8crlLBm+3echQrxiBV0wYeHNsziBCpCHr55ALAPZcs2QgZI66gmHaELkAZwCWXoCfPIoBwdoQ+QRpFHMeJN+Bhz4rmhjZABplLoQnfUm45hRL0McOYQESAnA2oVEWDE7AiSj/j43bxWAVJP2G34r74BSZC70FSTj7cAAAAASUVORK5CYII=' />
      </div>
      <input type="text" required="required" class="s-input">
      <div class="clear-btn">×</div>
      <div class='result'></div>
    </div>
</div>
`;
var style = `
<style>
.search2{
    position:absolute;
    z-index:2000;
    top:16px;
    left:16px;
    border: 2px solid rgba(0, 0, 0, 0.2);
    background-clip: padding-box;
    width: 400px;
    height: 44px;
    background-color: white;
    border-radius: 4px;
}
.search2 > div.input-wrapper{
    display: grid;
    height: 100%;
    position: relative;
    grid-template-columns: auto 1fr auto;
}
.search2 .search-icon{
    display: grid;
    place-items: center;
    width: 30px;
}
.search2 .search-icon img{
    width: 16px;
}
.search2 .s-input {
    width: 100%;
    height: 100%;
    line-height:100%;
    border:none;
    outline:none;
}
.search2 .s-input + .clear-btn{
    display:none;
    border-radius: 100%;
    cursor:pointer;
    width: 30px;
    place-items: center;
}
.search2 .s-input:valid + .clear-btn{
    display:grid;
}
.search2 .result{
  display:none;
  position:absolute;
  top:46px;
  background:#fff;
  width: 100%;
  background-clip: padding-box;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  border: 0 none;
}
.search2.show-result .result:empty{
  display:none;
}
.search2.show-result .result{
  display:block;
}
.search2 .result > div{
  border-bottom:1px solid #f1f1f1;
  font-size: 13px;
  padding: 7px 7px 7px 36px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  line-height:32px;
  background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAA8UlEQVR4AW2RtUEEQRiFcQ/xGvCHWwfbxYVIgleAQx9DhDSAZDg5fkiK+/Ctno4+W/lncpKbilRHL8rJ1lSuGZ3pmX4GKk+3q7TTaTutCHj7jqpSAwbxUTHV02N6hK0l293tVh8aBJWrnHUQZtWdCEx3WRn2Hl3Re0AGZToRWIUusM91WdAcaIF9NREYh26wd+qC3gnaQBlPBFr1p2/PqFCFG4T9qjWlCu8dIduCmdQyG/VOJY6HHdC7GtOPapnaD9oK2gp0CFrOPOpa3XVYDWsEO67abLcxTOBXv6yj2a+rRHt6p++pJGvAK7KOXpGs/QOhzWYklKHtRwAAAABJRU5ErkJggg==') no-repeat 8px center;
}
.search2 .result > div:last-child{
  border-bottom:none;
}
.search2 .result > div:hover{
  background-color: #d5f1f3;
}
</style>
`;

var Search = View.extend({
  initialize: function () {
    this.mapView = this.options.mapView;
    this.map = this.mapView._leafletMap;
    this.$mapDiv = $(this.mapView.el).parent();
  },

  render: function () {
    this.$el = $(template + style);
    this.$mapDiv.append(this.$el);
    this._bindEvents();
    return this;
  },

  clean: function () {
    $('.search2').remove();
    View.prototype.clean.call(this);
  },

  _bindEvents(){
    this.$el
    .on('input','input',_.debounce((e)=>{this._onInputChange(e)},500))
    .on('focus','input',e=>this._onInputFocus(e))
    .on('blur','input',e=>this._onInputBlur(e))
    .on('click','.clear-btn',e=>this._onClear(e))
    .on('click','.result>div',e=>this._onResultItemClick(e));
  },

  _onInputChange(e){
    const val = e.target.value;
    if(val === ''){
      this._onClear();
      return;
    }
    $.getJSON(`http://202.107.245.40:4002/v2/search?text=${val}&size=10`).then(res=>{
      this._setResult(res.features);
    });
  },

  _onInputFocus(e){
    this.$el.toggleClass('show-result');
  },

  _onInputBlur(e){
    const timer = setTimeout(()=>{
      this.$el.toggleClass('show-result');
      clearTimeout(timer);
    },200);
  },

  _onClear(e){
    this.$el.find('input').val('');
    this._setResult([]);
    this.geojson && this.geojson.remove();
  },

  _setResult(features){
    const $result = this.$el.find('.result');
    $result.empty();
    features.forEach(feature=>{
      let $item = $(`<div>${feature.properties.name}</div>`);
      $item.data('feature',feature);
      $item.appendTo($result);
    });
  },

  _onResultItemClick(e){
    this.geojson && this.geojson.remove();

    let $item = $(e.target);
    let feature = $item.data('feature');
    this.geojson = L.geoJSON({
      type: "FeatureCollection",
      features:[feature]
    },{
      pointToLayer(f,latlng){
        return L.marker(latlng,{
          icon: L.icon({
            iconUrl:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII='
          })
        });
      }
    });
    this.geojson.addTo(this.map);
    this.map.flyTo(this.geojson.getBounds().getCenter());

    this.$el.find('input').val(feature.properties.name);
  }
});

module.exports = Search;
