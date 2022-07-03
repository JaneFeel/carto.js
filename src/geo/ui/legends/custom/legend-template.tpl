<% if (items && items.length > 0) { %>
  <ul class="Legend-categoryList">
    <% for(var i in items) { %>
      <li class="Legend-categoryListItem u-flex u-alignCenter">
        <% if (items[i].style == 'polygon-fill') { %>
          <span class="Legend-categoryPolygon" style="opacity:1; background: <%= items[i].color %>;"></span>
        <% } else if (items[i].style == 'pattern-file' || items[i].style == 'line-color') { %>
          <span class="Legend-categoryFile" style="opacity:1; background-image: url(<%= items[i].icon %>);"></span>
        <% } else if (items[i].style == 'line-pattern-file') { %>
          <span class="Legend-categoryLineFile" style="opacity:1;"><span style="background-image: url(<%= items[i].icon %>);"></span></span>      
        <% } else if (items[i].icon) { %>
          <span class="Legend-categoryIcon js-image-container" data-icon="<%= items[i].icon %>" data-color="<%= items[i].color %>"></span>
        <% } else if (items[i].color) { %>
          <span class="Legend-categoryCircle" style="opacity:1; background: <%= items[i].color %>;"></span>
        <% } %>
        <p class="Legend-categoryTitle CDB-Text CDB-Size-small u-upperCase u-ellipsis" title="<%= items[i].title %>"><%= items[i].title %></p>
      </li>
    <% } %>
  </ul>
<% }%>
