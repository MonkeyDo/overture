"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('angular2/core');
var TopInfoComponent = (function () {
    function TopInfoComponent() {
    }
    TopInfoComponent = __decorate([
        core_1.Component({
            selector: 'top-info',
            template: "\n  <div class='square-box'>\n    <div class='square-content'>\n      <div class=\"main-video\">\n        <iframe id=\"video1\" src=\"https://www.youtube.com/embed/PprEQF9C0Qk\" frameborder=\"0\" allowfullscreen></iframe>\n      </div>\n      <div class='main-text'>\n        <h2 id=\"title0\">Improve music description to foster music exchange and reuse</h2>\n        <p>We create a FRBRoo-based data model and multilingual controlled vocabularies specifically designed for music, along with documentation, examples and tutorials.</p>\n        <h2 id=\"title1\">Travel to the heart of the musical archives of major French institutions</h2>\n        <p>We publish musical metadata coming form BnF, Radio France and Philharmonie de Paris on the web of data, and align datasets together with the major hubs of the Linked Open Data cloud.</p>\n        <h2 id=\"title2\">Conect sources, multiply usage, enrich user experience</h2>\n        <p>We develop a musical recommendation system based on the enriched data model and the interconnection of musical catalogs, in order to offer innovative services.</p>\n    </div>\n    </div>\n  </div>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], TopInfoComponent);
    return TopInfoComponent;
}());
exports.TopInfoComponent = TopInfoComponent;

//# sourceMappingURL=top-info.component.js.map
