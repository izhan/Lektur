var inkblob;

writefile = function(text) {
  stuff = parseParagraph();
  console.log("Writing to "+inkblob.filename + "...");
  filepicker.write(inkblob, stuff, function(InkBlob) {
      console.log('write success');
    }, function(error) {
      console.log(error.toString());
    }
  );
}


filepicker.setKey("A3UKsLvhQj6x7lvSjJGWQz");

