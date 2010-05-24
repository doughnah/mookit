/*
---

script: EzUpload.js

description: An interface for Swiff.Uploader

license: MIT-style license

authors:
- Harald Kirschner
- Samuel Birch

requires:
- core:1.2.4
- /Swiff/Swiff.uploader

provides: [EzUpload]

...
*/
var EzUpload = new Class({

	Extends: Swiff.Uploader,

	options: {
		limitSize: false,
		limitFiles: false,
		instantStart: false,
		allowDuplicates: false,
		validateFile: $lambda(true), // provide a function that returns true for valid and false for invalid files.

		fileInvalid: null, // called for invalid files with error stack as 2nd argument
		fileCreate: null, // creates file element after select
		fileUpload: null, // called when file is opened for upload, allows to modify the upload options (2nd argument) for every upload
		fileComplete: null, // updates the file element to completed state and gets the response (2nd argument)
		fileRemove: null, // removes the element
		OnAddFile: null
		/**
		 * Events:
		 * onSelect, onAllSelect, onCancel, onBeforeOpen, onOpen, onProgress, onComplete, onError, onAllComplete
		 */
	},

	initialize: function(element, options) {
		this.element = element;

		this.files = [];
		this.filesUploaded = [];
		this.totalFiles = 0;
		this.currentFile = 0;
		
		this.bytesLoaded = 0;
		this.bytesTotal = 0;
		
		this.options.fileTypes = options.fileTypes;
		this.options.onAddFile = options.OnAddFile;
		
		if (options.onload) {
			this.addEvent('load', options.onload);
			options.callBacks = null;
		}
		this.parent(options);
		this.render();
	},

	render: function() {
		this.hiddenFiles = this.element.getElement('.hiddenFiles');
		this.browseButton = this.element.getElement('.browse');
		this.uploadButton = this.element.getElement('.upload');
		this.summary = this.element.getElement('.summary');
		
		this.progress = this.element.getElement('.progress');
		this.progressSize = this.progress.getElement('.size');
		this.progressBar = new Fx.ProgressBar(this.progress.getElement('.bar img'), {
			text: this.progress.getElement('.percent')
		});
		
		this.fileList = this.element.getElement('.fileList');
		this.listItem = this.fileList.getElement('.file');
		this.listItem.getElement('.remove').setStyle('display', 'none');
		
		//
		this.browseButton.addEvent('click', function(){
			var id = '*.'+this.options.fileTypes.split(',').join(', *.');
			var value = '*.'+this.options.fileTypes.split(',').join('; *.');
			this.browse({id: value});
		}.bind(this));
		this.uploadButton.addEvent('click', function(){
			this.upload();
		}.bind(this));
	},

	onLoad: function() {
		this.log('Uploader ready!');
	},

	onBeforeOpen: function(file, options) {
		this.log('Initialize upload for "{name}".', file);
		var fn = this.options.fileUpload;
		return (fn) ? fn.call(this, this.getFile(file), options) : null;
	},

	onOpen: function(file, overall) {
		this.log('Starting upload "{name}".', file);
		file = this.getFile(file);
		file.status.set('html', 'Uploading...')
		file.element.addClass('file-uploading');
		//this.progressBar.cancel().set(0);
		//this.currentTitle.set('html', 'File Progress "{name}"'.substitute(file) );
	},

	onProgress: function(file, current, overall) {
		//console.log('onProgress')
		this.progressSize.set('html', this.sizeToKB(overall.bytesLoaded)+' / '+this.sizeToKB(overall.bytesTotal));
		this.progressBar.start(overall.bytesLoaded, overall.bytesTotal);
		//this.currentProgress.getElement('.size').set('html', 'Upload with {rate}/s'.substitute((current.rate) ? this.sizeToKB(current.rate) : '- B'))
		//this.currentProgress.getElement('.time').set('html', 'Time left: ~{timeLeft}'.substitute(Date.fancyDuration(current.timeLeft || 0)));
		//this.currentProgressIndicator.start(current.bytesLoaded, current.bytesTotal);
	},

	onSelect: function(file, index, length) {
		var errors = [];
		if (this.options.limitSize && (file.size > this.options.limitSize)) errors.push('size');
		if (this.options.limitFiles && (this.countFiles() >= this.options.limitFiles)) errors.push('length');
		if (!this.options.allowDuplicates && this.getFile(file)) errors.push('duplicate');
		if (!this.options.validateFile.call(this, file, errors)) errors.push('custom');
		if (errors.length) {
			var fn = this.options.fileInvalid;
			if (fn) fn.call(this, file, errors);
			return false;
		}
		file.displayName = file.name;
		file.name += '_'+ new Date().getTime();
		(this.options.fileCreate || this.fileCreate).call(this, file);
		
		this.listItem.setStyle('display', 'none');
		if(this.files.length == 0){
			this.currentFile = 0;
			this.totalFiles = 0;
			this.bytesLoaded = 0;
			this.progressBar.set(0);
		}else{
			
		}
		this.totalFiles ++;
		this.files.push(file);
		return true;
	},

	onAllSelect: function(files, current, overall) {
		this.log('Added ' + files.length + ' files, now we have (' + current.bytesTotal + ' bytes).', arguments);
		this.bytesTotal = current.bytesTotal;
		this.summary.set('html', files.length+' files added, '+this.totalFiles+' in total ('+this.sizeToKB(current.bytesTotal)+')');
		this.updateOverall(current.bytesTotal);
		this.progressSize.set('html', this.sizeToKB(this.bytesLoaded)+' / '+this.sizeToKB(this.bytesTotal));
		//this.status.removeClass('status-browsing');
		//this.progressBar.set(0);
		
		//this.totalFiles = this.files.length;
		if (this.totalFiles && this.options.instantStart) this.upload.delay(10, this);
	},

	onComplete: function(file, response) {
		this.log('Completed upload "' + file.name + '".', arguments);
		this.currentFile++;
		this.summary.set('html', 'Uploading '+(this.currentFile+1)+'/'+this.totalFiles);
		this.bytesLoaded += file.size;
		this.progressSize.set('html', this.sizeToKB(this.bytesLoaded)+' / '+this.sizeToKB(this.bytesTotal));
		//console.log(this.getFile(file))
		//this.getFile(file).status.set('html', 'Upload complete.');
		//this.currentProgressIndicator.start(100);
		this.progressBar.start(this.currentFile, this.totalFiles);
		(this.options.fileComplete || this.fileComplete).call(this, this.finishFile(file), response);
	},

	onError: function(file, error, info) {
		this.log('Upload "' + file.name + '" failed. "{1}": "{2}".', arguments);
		(this.options.fileError || this.fileError).call(this, this.finishFile(file), error, info);
	},

	onCancel: function() {
		this.log('Filebrowser cancelled.', arguments);
		//this.status.removeClass('file-browsing');
	},

	onAllComplete: function(current) {
		this.log('Completed all files, ' + current.bytesTotal + ' bytes.', arguments);
		this.summary.set('html', 'Uploaded '+this.totalFiles+' files');
		this.updateOverall(current.bytesTotal);
		this.progressBar.start(100);
		(function(){
			this.listItem.setStyle('display', 'block')
		}).delay(2000, this);
		this.totalFiles = 0;
		//this.status.removeClass('file-uploading');
	},

	browse: function(fileList) {
		var ret = this.parent(fileList);
		if (ret !== true){
			this.log('Browse in progress.');
			if (ret) alert(ret);
		} else {
			this.log('Browse started.');
			//this.status.addClass('file-browsing');
		}
	},

	upload: function(options) {
		var ret = this.parent(options);
		if (ret !== true) {
			this.log('Upload in progress or nothing to upload.');
			if (ret) alert(ret);
		} else {
			this.log('Upload started.');
			this.summary.set('html', 'Uploading '+(this.currentFile+1)+'/'+this.totalFiles);
			//this.status.addClass('file-uploading');
			this.progressBar.set(0);
		}
	},

	removeFile: function(file) {
		var remove = this.options.fileRemove || this.fileRemove;
		if (!file) {
			this.files.each(remove, this);
			this.files.empty();
			this.updateOverall(0);
		} else {
			if (!file.element) file = this.getFile(file);
			this.files.erase(file);
			remove.call(this, file);
			this.updateOverall(this.bytesTotal - file.size);
		}
		this.parent(file);
	},

	getFile: function(file) {
		var ret = null;
		this.files.some(function(value) {
			//console.log(value.displayName+' : '+file.name)
			if ((value.displayName != file.name) || (value.size != file.size)) return false;
			ret = value;
			return true;
		});
		return ret;
	},

	countFiles: function() {
		var ret = 0;
		for (var i = 0, j = this.files.length; i < j; i++) {
			if (!this.files[i].finished) ret++;
		}
		return ret;
	},

	updateOverall: function(bytesTotal) {
		//this.bytesTotal = bytesTotal;
		//this.progressSize.set('html', this.sizeToKB(bytesTotal));
	},

	finishFile: function(file) {
		file = this.getFile(file);
		//file.element.removeClass('file-uploading');
		file.status.set('html', 'Upload complete');
		this.removeFile.delay(1000, this, file);
		file.finished = true;
		return file;
	},

	fileCreate: function(file) {
		file.element = this.listItem.clone().inject(this.fileList).set('style', 'display:block');
		file.status = file.element.getElement('.status').set('html', 'Queued');
		file.element.getElement('.size').set('html', this.sizeToKB(file.size));
		file.element.getElement('.name').set('html', file.displayName);
		file.element.getElement('.remove').setStyle('display', 'inline').addEvent('click', function(){this.removeFile(file);return false;}.bind(this));
		if(this.options.OnAddFile){this.options.OnAddFile()};	
	},

	fileComplete: function(file, response) {
		this.options.processResponse || this
		var json = $H(JSON.decode(response, true));
		if (json.get('result') == 'success') {
			this.filesUploaded.push(file.name);
			this.hiddenFiles.set('value', this.filesUploaded.join(','))
			file.element.addClass('file-success');
			//file.status.set('html', json.get('size'));
			
		} else {
			file.element.addClass('file-failed');
			file.status.set('html', json.get('error') || response);
		}
	},

	fileError: function(file, error, info) {
		file.element.addClass('file-failed');
		file.status.set('html', '<strong>' + error + '</strong><br />' + info);
	},

	fileRemove: function(file) {
		file.element.fade('out').retrieve('tween').chain(Element.destroy.bind(Element, file.element));
	},

	sizeToKB: function(size) {
		var unit = 'B';
		if ((size / 1048576) > 1) {
			unit = 'MB';
			size /= 1048576;
		} else if ((size / 1024) > 1) {
			unit = 'kB';
			size /= 1024;
		}
		return size.round(1) + ' ' + unit;
	},

	log: function(text, args) {
		if (window.console) console.log(text.substitute(args || {}));
	}

});
