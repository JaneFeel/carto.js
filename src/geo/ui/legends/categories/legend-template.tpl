<% if (categories && categories.length > 0) { %>
  <ul class="Legend-categoryList">
    <% for(var i in categories) { %>
      <li class="Legend-categoryListItem u-flex u-alignCenter">
        <% if (categories[i].style == 'polygon-fill') { %>
          <span class="Legend-categoryPolygon" style="opacity:1; background: <%= categories[i].color %>;"></span>
        <% } else if (categories[i].style == 'pattern-file') { %>
          <span class="Legend-categoryFile" style="opacity:1; background: <%= categories[i].icon %>;"></span>
        <% } else if (categories[i].icon) { %>
          <span class="Legend-categoryIcon js-image-container" data-icon="<%= categories[i].icon %>" data-color="<%= categories[i].color %>"></span>
        <% } else if (categories[i].color) { %>
          <span class="Legend-categoryCircle" style="opacity:1; background: <%= categories[i].color %>;"></span>
        <% } %>
        <p class="Legend-categoryTitle CDB-Text CDB-Size-small u-upperCase u-ellipsis" title="<%= categories[i].title %>"><%= categories[i].title %></p>
      </li>
    <% } %>
  </ul>
<% }%>
