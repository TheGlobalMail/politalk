(function() {
    'use strict';

    var keywords = [
      'asylum seeker',
      'refugee',
      'boat people',
      'illegals'
    ];

    $(function(){
      var $thead = $('#asylum thead');
      var html = '<tr>';
      html += '<th>Date</th>';
      _.each(keywords, function(keyword){
        html += '<th>' + keyword + '</th>';
      });
      html += '</tr>';
      $thead.append(html);


      var $tbody = $('#asylum tbody');
      $.getJSON('http://localhost:8080/api/wordchoices/asylum', function(json){ 
        var data = [];
        window.data = data;


        _.each(json, function(row){
          if (row.count !== 0 && !_.contains(['DPRES', 'CWM'], row.party)){
            var datum;
            var existingDatum = _.detect(data, function(r){ return r.date === row.date; });
            if (!existingDatum){
              datum = {date: row.date};
              datum[row.keyword] = [{name: row.party, count: row.count}];
              data.push(datum);
            }else{
              var existingKeyword = existingDatum[row.keyword];
              if (!existingKeyword){
                existingDatum[row.keyword] = [{name: row.party, count: row.count, ids: row.ids, keywords: row.keywords}];
              }else{
                existingKeyword.push({name: row.party, count: row.count, ids: row.ids, keywords: row.keywords});
              }
            }
          }
        });

        $tbody.empty();

        _.each(data, function(datum){
          var html = '<tr><td>' + datum.date + '</td>';
          _.each(keywords, function(keyword){
            html += '<td><ul class="wordchoices">';
            if (datum[keyword]){
              _.each(datum[keyword], function(party){
                var keywords = _.map(party.keywords, function(keyword){
                  return keyword.text + ' (' + keyword.frequency + ')';
                });
                html += '<li class="' + party.name.toLowerCase().replace(/ /g, '_')  + '">';
                html += '<a title="Uses of ' + keyword + '" href="#more-modal" class="more" data-keyword="' + keyword + '" data-ids="' + (party.ids ? party.ids.join(",") : '') + '">';
                html += party.name + ": " + party.count;
                html += '</a>';
                if (keywords.length){
                  html += '<a title="' + keywords.join(", ") + '" href="#more-modal" class="more" data-keyword="' + keyword + '" data-ids="' + (party.ids ? party.ids.join(",") : '') + '">';
                  html += '&nbsp;[keywords]';
                  html += '</a>';
                }
                html += '</li>';
              });
            }
            html += '</ul></td>';
          });
          html += '</tr>';
          $tbody.append(html); 
        });
        $('a.more').click(function(e){
          e.preventDefault();
          var $link = $(this);
          var ids = $(this).data('ids').split(',');
          var keyword = $(this).data('keyword');
          $('#more').html('Loading..');
          $(this).modal('show');
          $('#more-modal').removeClass('hide');
          $.getJSON('http://localhost:8080/api/hansards', {ids: ids}, function(json){
            var html = '';
            _.each(json, function(hansard){
              html += '<h2>' + hansard.speaker + ' (' + hansard.party + ') on ' + moment(hansard.time).format('MMMM Do YYYY, h:mm a') + '</h2>';
              html += hansard.html.replace(new RegExp(keyword, 'gmi'), '<span class="highlight">' + keyword + '</span>');
            });
            $('#myModalLabel').html('Uses of ' + keyword);
            $('#more').html(html);
            $('#close-modal').click(function(e){
              e.preventDefault();
              $link.modal('hide');
              $('#more-modal').addClass('hide');
              $link.show();
            });
          });
        });
      });

    });

}());

