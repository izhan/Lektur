//////////// Languages
var langs =
[['Afrikaans',       ['af-ZA']],
 ['Bahasa Indonesia',['id-ID']],
 ['Bahasa Melayu',   ['ms-MY']],
 ['Català',          ['ca-ES']],
 ['Čeština',         ['cs-CZ']],
 ['Deutsch',         ['de-DE']],
 ['English',         ['en-AU', 'Australia'],
                     ['en-CA', 'Canada'],
                     ['en-IN', 'India'],
                     ['en-NZ', 'New Zealand'],
                     ['en-ZA', 'South Africa'],
                     ['en-GB', 'United Kingdom'],
                     ['en-US', 'United States']],
 ['Español',         ['es-AR', 'Argentina'],
                     ['es-BO', 'Bolivia'],
                     ['es-CL', 'Chile'],
                     ['es-CO', 'Colombia'],
                     ['es-CR', 'Costa Rica'],
                     ['es-EC', 'Ecuador'],
                     ['es-SV', 'El Salvador'],
                     ['es-ES', 'España'],
                     ['es-US', 'Estados Unidos'],
                     ['es-GT', 'Guatemala'],
                     ['es-HN', 'Honduras'],
                     ['es-MX', 'México'],
                     ['es-NI', 'Nicaragua'],
                     ['es-PA', 'Panamá'],
                     ['es-PY', 'Paraguay'],
                     ['es-PE', 'Perú'],
                     ['es-PR', 'Puerto Rico'],
                     ['es-DO', 'República Dominicana'],
                     ['es-UY', 'Uruguay'],
                     ['es-VE', 'Venezuela']],
 ['Euskara',         ['eu-ES']],
 ['Français',        ['fr-FR']],
 ['Galego',          ['gl-ES']],
 ['Hrvatski',        ['hr_HR']],
 ['IsiZulu',         ['zu-ZA']],
 ['Íslenska',        ['is-IS']],
 ['Italiano',        ['it-IT', 'Italia'],
                     ['it-CH', 'Svizzera']],
 ['Magyar',          ['hu-HU']],
 ['Nederlands',      ['nl-NL']],
 ['Norsk bokmål',    ['nb-NO']],
 ['Polski',          ['pl-PL']],
 ['Português',       ['pt-BR', 'Brasil'],
                     ['pt-PT', 'Portugal']],
 ['Română',          ['ro-RO']],
 ['Slovenčina',      ['sk-SK']],
 ['Suomi',           ['fi-FI']],
 ['Svenska',         ['sv-SE']],
 ['Türkçe',          ['tr-TR']],
 ['български',       ['bg-BG']],
 ['Pусский',         ['ru-RU']],
 ['Српски',          ['sr-RS']],
 ['한국어',            ['ko-KR']],
 ['中文',             ['cmn-Hans-CN', '普通话 (中国大陆)'],
                     ['cmn-Hans-HK', '普通话 (香港)'],
                     ['cmn-Hant-TW', '中文 (台灣)'],
                     ['yue-Hant-HK', '粵語 (香港)']],
 ['日本語',           ['ja-JP']],
 ['Lingua latīna',   ['la']]];

for (var i = 0; i < langs.length; i++) {
  select_language.options[i] = new Option(langs[i][0], i);
}
select_language.selectedIndex = 6;
updateCountry();
select_dialect.selectedIndex = 6;
showInfo('info_start');

function updateCountry() {
  for (var i = select_dialect.options.length - 1; i >= 0; i--) {
    select_dialect.remove(i);
  }
  var list = langs[select_language.selectedIndex];
  for (var i = 1; i < list.length; i++) {
    select_dialect.options.add(new Option(list[i][1], list[i][0]));
  }
  select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
}

function trim1 (str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function parseParagraph() {
  output = '';
  sentences = $('#final_span li');
  for (var i = 0; i < sentences.length; i++)
  {
    sentence = $(sentences[i]);
    if (sentence.attr('class') == "floatleft")
      output += "- " + trim1(sentence.text()) + "\n";
    else {
      output += "      - " + trim1(sentence.text()) + "\n";
    }
  }
  sentences = $('#final_temp li');
  for (var i = 0; i < sentences.length; i++)
  {
    sentence = $(sentences[i]);
    if (sentence.attr('class') == "floatleft")
      output += "- " + trim1(sentence.text()) + "\n";
    else {
      output += "      - " + trim1(sentence.text()) + "\n";
    }
  }
  return output;
}

var create_email = false;
var final_transcript = '';
var counter = 0;
var all_text = '';
var four_sentences = '';
var recognizing = false;
var fileselected = false;
var ignore_onend;
var start_timestamp;
var prevTopics = [];
if (!('webkitSpeechRecognition' in window)) {
  upgrade();
} else {
  start_button.style.display = 'inline-block';
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = function() {
    recognizing = true;
    showInfo('info_speak_now');
    start_img.src = 'https://www.google.com/intl/en/chrome/assets/common/images/content/mic-animate.gif';
  };

  recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
      start_img.src = 'https://www.google.com/intl/en/chrome/assets/common/images/content/mic.gif';
      showInfo('info_no_speech');
      ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
      start_img.src = 'https://www.google.com/intl/en/chrome/assets/common/images/content/mic.gif';
      showInfo('info_no_microphone');
      ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
      if (event.timeStamp - start_timestamp < 100) {
        showInfo('info_blocked');
      } else {
        showInfo('info_denied');
      }
      ignore_onend = true;
    }
  };

  recognition.onend = function() {
    recognizing = false;
    if (ignore_onend) {
      return;
    }
    start_img.src = 'https://www.google.com/intl/en/chrome/assets/common/images/content/mic.gif';
    if (!final_transcript) {
      showInfo('info_start');
      return;
    }
    showInfo('');
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
      var range = document.createRange();
      range.selectNode(document.getElementById('final_span'));
      window.getSelection().addRange(range);
    }
    if (create_email) {
      create_email = false;
      createEmail();
    }
  };

  recognition.onresult = function(event) {
    var interim_transcript = '';
    final_transcript = '';
    var color;
    if (typeof(event.results) == 'undefined') {
      recognition.onend = null;
      recognition.stop();
      upgrade();
      return;
    }
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        console.log(event.results[i][0].confidence + "for : " + event.results[i][0])
        if (event.results[i][0].confidence > 0.75)
          color = "rgb(" + Math.round(150-150*4*(event.results[i][0].confidence-.75)) + ",255," + Math.round(150-150*4*(event.results[i][0].confidence-.75)) + ")";
        else
          color = "rgb(255, " + Math.round(200*event.results[i][0].confidence) + "," + Math.round(200*event.results[i][0].confidence) + ")";
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    final_transcript = capitalize(final_transcript);
    if (final_transcript)
    {
      counter++;
      four_sentences += final_transcript;
      all_text += final_transcript;
      if ((counter%4) == 0)
      {
        counter = 0;
        $.ajax({
          type: "GET",
          crossDomain: true,
          dataType: 'jsonp',
          jsonp: 'jsonp',
          url: "http://access.alchemyapi.com/calls/text/TextGetRankedConcepts",
          success: function(data) {
            console.log(data);
            if (data.concepts.length > 0) {
              if (data.concepts[0].relevance > 0.75)
              {
                final_span.innerHTML += "<li class='floatleft' style='color:blue;'>" + data.concepts[0].text + "</li>";
                if (inkblob)
                  writefile(all_text);
              }
            }
            four_sentences = '';
            temp = $('#final_temp');
            final_span.innerHTML += temp[0].innerHTML;
            if (inkblob)
              writefile(all_text);
            temp[0].innerHTML = "";
          },
          data: { outputMode: "json", text: four_sentences, apikey: "12c03efad5071dc17762332480c35cf703a3315b" }
        });
      }
      final_temp.innerHTML += "<li style='color:" + color + ";' class='bullet-point'>" + linebreak(final_transcript) + "</li>";
      // bit of a hack...inefficient
      $('.bullet-point').hover(function(){
        $(this).css("color", "black");
      });
    }
    interim_span.innerHTML = linebreak(interim_transcript);
    if (final_transcript || interim_transcript) {
      showButtons('inline-block');
    }
  };
}

function upgrade() {
  start_button.style.visibility = 'hidden';
  showInfo('info_upgrade');
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

function createEmail() {
  var n = final_transcript.indexOf('\n');
  if (n < 0 || n >= 80) {
    n = 40 + final_transcript.substring(40).indexOf(' ');
  }
  var subject = encodeURI(final_transcript.substring(0, n));
  var body = encodeURI(final_transcript.substring(n + 1));
  window.location.href = 'mailto:?subject=' + subject + '&body=' + body;
}

function copyButton() {
  if (recognizing) {
    recognizing = false;
    recognition.stop();
  }
  copy_info.style.display = 'inline-block';
  showInfo('');
}

function emailButton() {
  if (recognizing) {
    create_email = true;
    recognizing = false;
    recognition.stop();
  } else {
    createEmail();
  }
  email_button.style.display = 'none';
  email_info.style.display = 'inline-block';
  showInfo('');
}
function importButton(event) {
  filepicker.pick({mimetype:'text/plain'}, function(InkBlob){
    inkblob = InkBlob;
    filepicker.read(inkblob, function(data){
      final_span.innerHTML = data;
      all_text = data;
    });
    fileselected = true;
  });
}

function exportButton(event) {
  if (inkblob) {
    filepicker.export(inkblob, {service:'DROPBOX'}, function(InkBlob) {
      showInfo('info_saved');
    });
  }
  else {
    filepicker.store(parseParagraph(),
        {filename:'lecture_notes', location: 'S3'},
        function(stored_file){
            filepicker.export(stored_file, {service:'DROPBOX'}, function(InkBlob) {
                $("#filename-title").text(InkBlob.filename);
                inkblob = InkBlob;
            }
        );
    });
  }
}

function startButton(event) {
  if (recognizing) {
    recognition.stop();
    return;
  }
  final_transcript = '';
  recognition.lang = select_dialect.value;
  recognition.start();
  ignore_onend = false;
  //final_span.innerHTML = '';
  interim_span.innerHTML = '';
  start_img.src = 'https://www.google.com/intl/en/chrome/assets/common/images/content/mic-slash.gif';
  showInfo('info_allow');
  showButtons('none');
  start_timestamp = event.timeStamp;
}

function showInfo(s) {
  if (s) {
    for (var child = info.firstChild; child; child = child.nextSibling) {
      if (child.style) {
        child.style.display = child.id == s ? 'inline' : 'none';
      }
    }
    info.style.visibility = 'visible';
  } else {
    info.style.visibility = 'hidden';
  }
}

var current_style;
function showButtons(style) {
  if (style == current_style) {
    return;
  }
  current_style = style;
  email_button.style.display = style;
  copy_info.style.display = 'none';
  email_info.style.display = 'none';
}