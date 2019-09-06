var app;
(function (app) {
    var MainController = /** @class */ (function () {
        function MainController($scope, mdPickerColors, dlg) {
            var _this = this;
            this.$scope = $scope;
            this.mdPickerColors = mdPickerColors;
            this.dlg = dlg;
            this.initCanvas = function () {
                _this.canvas = new fabric.Canvas('c');
                _this.canvas.setDimensions({
                    width: window.innerWidth * 0.7,
                    height: window.innerHeight
                });
                _this.canvas.setBackgroundColor('#565656', _this.canvas.renderAll.bind(_this.canvas));
                // extra canvas settings
                _this.canvas.preserveObjectStacking = true;
                _this.canvas.stopContextMenu = true;
                _this.canvas.on('object:selected', function () {
                    _this.$scope.$evalAsync(function () {
                        _this.activeObject = _this.canvas.getActiveObject();
                        _this.color = _this.mdPickerColors.getColor(_this.activeObject.get('fill'));
                        _this.opacity = _this.activeObject.get('opacity') * 100;
                    });
                });
                _this.canvas.on('selection:cleared', function () {
                    _this.$scope.$evalAsync(function () {
                        _this.activeObject = null;
                        _this.color = null;
                        _this.opacity = 0;
                    });
                });
                _this.canvas.on('selection:updated', function () {
                    _this.$scope.$evalAsync(function () {
                        _this.activeObject = _this.canvas.getActiveObject();
                        _this.color = _this.mdPickerColors.getColor(_this.activeObject.get('fill'));
                        _this.opacity = +(_this.activeObject.get('opacity') * 100).toFixed();
                    });
                });
            };
            this.onWindowResize = function () {
                _this.canvas.setDimensions({
                    width: window.innerWidth * 0.7,
                    height: window.innerHeight
                });
            };
            this.addText = function () {
                var text = new fabric.IText('Sample Text', {
                    left: _this.canvas.width / 2,
                    top: _this.canvas.height / 2,
                    fill: '#e0f7fa',
                    fontFamily: 'sans-serif',
                    hasRotatingPoint: false,
                    centerTransform: true,
                    originX: 'center',
                    originY: 'center',
                    lockUniScaling: true
                });
                _this.canvas.add(text);
                text.on('scaling', function () {
                    _this.$scope.$evalAsync();
                });
            };
            this.addRect = function () {
                _this.canvas.add(new fabric.Rect({
                    left: _this.canvas.width / 2,
                    top: _this.canvas.height / 2,
                    fill: '#ffa726',
                    width: 100,
                    height: 100,
                    originX: 'center',
                    originY: 'center',
                    strokeWidth: 0
                }));
            };
            this.addCircle = function () {
                _this.canvas.add(new fabric.Circle({
                    left: _this.canvas.width / 2,
                    top: _this.canvas.height / 2,
                    fill: '#26a69a',
                    radius: 50,
                    originX: 'center',
                    originY: 'center',
                    strokeWidth: 0
                }));
            };
            this.addTriangle = function () {
                _this.canvas.add(new fabric.Triangle({
                    left: _this.canvas.width / 2,
                    top: _this.canvas.height / 2,
                    fill: '#78909c',
                    width: 100,
                    height: 100,
                    originX: 'center',
                    originY: 'center',
                    strokeWidth: 0
                }));
            };
            this.addImage = function (ev) {
                var confirm = _this.dlg.prompt()
                    .title('Add Image')
                    .textContent('Copy and paste link of the image:')
                    .placeholder('http://myimageurl.com')
                    .ariaLabel('Image Url')
                    .targetEvent(ev)
                    .ok('Ok')
                    .cancel('Cancel');
                _this.dlg.show(confirm).then(function (result) {
                    fabric.Image.fromURL(result, function (img) {
                        _this.canvas.add(img);
                    });
                });
            };
            this.remove = function () {
                var activeObjects = _this.canvas.getActiveObjects();
                _this.canvas.discardActiveObject();
                if (activeObjects.length) {
                    _this.canvas.remove.apply(_this.canvas, activeObjects);
                }
            };
            this.getStyle = function () {
                if (_this.activeObject != null) {
                    if (_this.color != null) {
                        if (_this.color.hex !== _this.activeObject.fill.toLowerCase()) {
                            _this.activeObject.set('fill', _this.color.hex);
                            _this.canvas.requestRenderAll();
                        }
                        return _this.color.style;
                    }
                    else {
                        return {
                            'background-color': _this.activeObject.fill,
                            'color': _this.activeObject.fill
                        };
                    }
                }
            };
            this.getFontSize = function () {
                if (!_this.activeObject) {
                    return 0;
                }
                var size = _this.activeObject.fontSize || 0;
                return +(size * _this.activeObject.scaleX).toFixed();
            };
            this.setOpacity = function () {
                if (_this.opacity < 0) {
                    _this.opacity = 0;
                }
                if (_this.opacity > 100) {
                    _this.opacity = 100;
                }
                _this.activeObject.set('opacity', _this.opacity / 100);
                _this.canvas.requestRenderAll();
            };
            this.initCanvas();
            this.addText();
            this.canvas.setActiveObject(this.canvas.item(0));
            window.addEventListener('resize', this.onWindowResize);
        }
        MainController.$inject = ['$scope', 'mdPickerColors', '$mdDialog'];
        return MainController;
    }());
    angular
        .module('app', ['ngMaterial', 'mdColorMenu'])
        .controller('MainController', MainController);
})(app || (app = {}));