module app {
  class MainController {
    canvas: fabric.Canvas;
    activeObject: fabric.Object;
    color: any;
    opacity: number;
    
    static $inject = ['$scope', 'mdPickerColors', '$mdDialog'];
    
    constructor(private $scope: ng.IScope, private mdPickerColors: any, private dlg: any) {
      this.initCanvas();
      this.addText();
      this.canvas.setActiveObject(this.canvas.item(0));
      window.addEventListener('resize', this.onWindowResize);
    }
    
    initCanvas = () => {
      this.canvas = new fabric.Canvas('c');
      this.canvas.setDimensions({
        width: window.innerWidth * 0.7,
        height: window.innerHeight
      });
      this.canvas.setBackgroundColor('#565656', this.canvas.renderAll.bind(this.canvas));
      
      // extra canvas settings
      this.canvas.preserveObjectStacking = true;
      this.canvas.stopContextMenu = true;
      
      this.canvas.on('object:selected', () => {
        this.$scope.$evalAsync(() => {
          this.activeObject = this.canvas.getActiveObject();
          this.color = this.mdPickerColors.getColor(this.activeObject.get('fill'));
          this.opacity = this.activeObject.get('opacity') * 100;
        });
      });
      
      this.canvas.on('selection:cleared', () => {
        this.$scope.$evalAsync(() => {
          this.activeObject = null; 
          this.color = null;
          this.opacity = 0;
        });
      });
      
      this.canvas.on('selection:updated', () => {
        this.$scope.$evalAsync(() => {
          this.activeObject = this.canvas.getActiveObject();
          this.color = this.mdPickerColors.getColor(this.activeObject.get('fill'));
          this.opacity = +(this.activeObject.get('opacity') * 100).toFixed();
        });
      });
    }
    
    onWindowResize = () => {
      this.canvas.setDimensions({
        width: window.innerWidth * 0.7,
        height: window.innerHeight
      });
    }
    
    addText = () => {
      let text = new fabric.IText('Sample Text', {
        left: this.canvas.width / 2,
        top: this.canvas.height / 2,
        fill: '#e0f7fa',
        fontFamily: 'sans-serif',
        hasRotatingPoint: false,
        centerTransform: true,
        originX: 'center',
        originY: 'center',
        lockUniScaling: true
      });
      
      this.canvas.add(text);
      
      text.on('scaling', () => {
        this.$scope.$evalAsync();
      });
    }
    
    addRect = () => {
      this.canvas.add(new fabric.Rect({
        left: this.canvas.width / 2,
        top: this.canvas.height / 2,
        fill: '#ffa726',
        width: 100,
        height: 100,
        originX: 'center',
        originY: 'center',
        strokeWidth: 0
      }));
    }
    
    addCircle = () => {
      this.canvas.add(new fabric.Circle({
        left: this.canvas.width / 2,
        top: this.canvas.height / 2,
        fill: '#26a69a',
        radius: 50,
        originX: 'center',
        originY: 'center',
        strokeWidth: 0
      }));
    }
    
    addTriangle = () => {
      this.canvas.add(new fabric.Triangle({
        left: this.canvas.width / 2,
        top: this.canvas.height / 2,
        fill: '#78909c',
        width: 100,
        height: 100,
        originX: 'center',
        originY: 'center',
        strokeWidth: 0
      }));
    }
    
    addImage = (ev) => {
      let confirm = this.dlg.prompt()
        .title('Add Image')
        .textContent('Copy and paste link of the image:')
        .placeholder('http://myimageurl.com')
        .ariaLabel('Image Url')
        .targetEvent(ev)
        .ok('Ok')
        .cancel('Cancel');

      this.dlg.show(confirm).then((result) => {
        fabric.Image.fromURL(result, (img) => {
          this.canvas.add(img); 
        });
      });
    }
    
    remove = () => {
      let activeObjects = this.canvas.getActiveObjects();
      this.canvas.discardActiveObject();
      if (activeObjects.length) {
        this.canvas.remove.apply(this.canvas, activeObjects);
      }
    }
    
    getStyle = () => {
         if (this.activeObject != null) {
            if (this.color != null) {
               if (this.color.hex !== this.activeObject.fill.toLowerCase()) {
                  this.activeObject.set('fill', this.color.hex);
                  this.canvas.requestRenderAll();
               }

               return this.color.style;
            }
            else {
               return {
                  'background-color': this.activeObject.fill,
                  'color': this.activeObject.fill
               };
            }
         }
      }
    
      getFontSize = () => {
        if (!this.activeObject) {
          return 0;
        }
        
        let size = this.activeObject.fontSize || 0;
        return +(size * this.activeObject.scaleX).toFixed();
      }  
    
      setOpacity = () => {
        if (this.opacity < 0) {
          this.opacity = 0;
        }
        
        if (this.opacity > 100) {
          this.opacity = 100;
        }
        
        this.activeObject.set('opacity', this.opacity / 100);
        this.canvas.requestRenderAll();
      }
  }
  
  angular
    .module('app', ['ngMaterial', 'mdColorMenu'])
    .controller('MainController', MainController);
}