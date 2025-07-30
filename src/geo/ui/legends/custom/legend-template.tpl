<ul class="Legend-categoryList">
  <% for(var i in items) { %>
    <li class="Legend-categoryListItem u-flex u-alignCenter">
      <% if (items[i].style == 'polygon') { %>
        <% if (items[i].icon) { %>
          <span class="Legend-categoryPolygon" style="background-image: url(<%= items[i].icon %>);<%
            if (items[i].stroke) {
              %> border: 1px solid <%= items[i].stroke %>;<%
            } else {
              %> border: 1px solid <%= items[i].color %>;<%
            }
          %>"></span>
        <% } else { %>
          <span class="Legend-categoryPolygon" style="background: <%= items[i].color %>;<%
            if (items[i].stroke) {
              %> border: 1px solid <%= items[i].stroke %>;<%
            } else {
              %> border: 1px solid <%= items[i].color %>;<%
            }
          %>"></span>
        <% } %>
      <% } else if (items[i].style == 'pattern') { %>
        <span class="Legend-categoryFile" style="background-image: url(<%= items[i].icon %>);"></span>
      <% } else if (items[i].style == 'line-pattern-file') { %>
        <span class="Legend-categoryLineFile"><span style="background-image: url(<%= items[i].icon %>);"></span></span>
      <% } else if (items[i].icon) { %>
        <span class="Legend-categoryIcon js-image-container" data-icon="<%= items[i].icon %>" <% if (items[i].color) { %>data-color="<%= items[i].color %>"<% } %>></span>
      <% } else if (items[i].color) { %>
        <span class="Legend-categoryCircle" style="background: <%= items[i].color %>;"></span>
      <% } %>

      <p class="Legend-categoryTitle CDB-Text CDB-Size-small u-ellipsis" title="<%= items[i].title %>"><%= items[i].title %></p>
    </li>
  <% } %>
</ul>
