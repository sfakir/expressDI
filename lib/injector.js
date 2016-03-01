'use strict';
class Injector {
    constructor(rootPath, locations) {
        this.dependencyTree = new Tree.Tree();
        this.dependencyTree.resolveAsync = Promise.promisify(this.dependencyTree.resolve);
        this.locations = [];
        this.root = rootPath;

        if (!locations)
            throw new Error('[Injector] Locations are required');

        if (!rootPath)
            throw new Error('[Injector] Rootpath is required');


        this.setLocations(locations);
        //...
    }
    update(camera) {
        //...
        super.update();
    }
    get boneCount() {
        return this.bones.length;
    }
    set matrixType(matrixType) {
        this.idMatrix = SkinnedMesh[matrixType]();
    }
    static defaultMatrix() {
        return new THREE.Matrix4();
    }
}