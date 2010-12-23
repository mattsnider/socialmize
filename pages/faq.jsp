<%@ taglib uri="/WEB-INF/tld/studs-template.tld" prefix="template" %>
<%@ taglib uri="/WEB-INF/tld/phase-string.tld" prefix="str" %>
<%@ taglib uri="/WEB-INF/tld/phase-core.tld" prefix="c" %>
<template:insert template="/pages/tmpl/core-tpl.psp">

	<template:put name="title" content="FAQ" direct="true"/>

	<template:put name="header" direct="true">Welcome to ${projectNameUC} FAQ</template:put>

	<template:put name="content" direct="true">

		<div class="profile panel" id="section-1">

			<h3>Profile</h3>

            <p>Profile pages are a place that information about a person, place, or thing can be filled out. The number
            and type of fields are defined by your site's administrator, but here is an explanation of the possible
            field types that you might encounter.</p>

			<div class="content">

                <a href="javascript:void(null);" name="profile-fields"></a>
                <dl class="definition">
                    <dt><strong>Autocomplete</strong></dt>
                    <dd><p>These fields are textual inputs, which provide hints to a user as they type, based on how other users have filled out this field.
                        Autocomplete fields will not show hints until a few users have updated this field.</p</dd>
                    <dt><strong>Datetime</strong></dt>
                    <dd><p>These fields are for single dates, such as birthdays. It will be displayed as three dropdown fields: day, month, year.</p</dd>
                    <dt><strong>Daterange</strong></dt>
                    <dd><p>These fields are for events that begin at a certain time and end at another time, such as time worked for a company. It will be displayed as two sets of month and year dropdowns.</p</dd>
                    <dt><strong>List</strong></dt>
                    <dd><p>These fields are for values where the user can enter comma separated items, such as favorite books or activities.</p</dd>
                    <dt><strong>Portrait</strong></dt>
                    <dd><p>These fields are for where a user can upload an image for the profile; there should only be 1 of these per profile.</p</dd>
                    <dt><strong>Select</strong></dt>
                    <dd><p>These fields are for a pre-defined dropdown list of items that a user can choose. Administrators must specify all possible options (see gender for a simple example).</p</dd>
                    <dt><strong>Text</strong></dt>
                    <dd><p>These fields are for textual values that can be between 2 and 255 characters long.</p</dd>
                    <dt><strong>Textarea</strong></dt>
                    <dd><p>These fields are for textual values that can be between 256 and 4294967295 characters long.</p</dd>
                </dl>

			</div>

		</div>

	</template:put>
</template:insert>
