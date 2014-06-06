---
layout: inner-page
title: Self-hosted MapIt
---

Technical Overview
------------------

The `mapit` directory contains a standard [GeoDjango] app, and the `project`
directory contains an example GeoDjango project using that app. Other top-level
things are mostly to fit within mySociety's standard deployment, or country
specific data, one-off scripts and so on.

MapIt has been installed on Debian lenny and squeeze, and on Ubuntu from 10.04
onwards. If GeoDjango and [PostGIS] run on it, it should theoretically be okay;
do let us know of any problems.

Installation
------------

MapIt can be installed as a Django app, or as a standalone server. For full
details, see the [installation documentation](install/).

Importing data
--------------

There are various ways to import data into MapIt, ranging from manually to
importing KML files. We have also supplied notes for some of the countries
that MapIt has been set up for; see the links in the navigation.

Contact
-------

Improvements, patches, questions and comments are all welcome. The code is
hosted on GitHub and we use their bug tracker too, so please open a ticket
there:

* GitHub home: <https://github.com/mysociety/mapit>
* GitHub issues: <https://github.com/mysociety/mapit/issues>

You can also chat to us on IRC: #mschat on [irc.mysociety.org](http://www.irc.mysociety.org).

[mySociety]: http://www.mysociety.org/
[MapIt Global]: http://global.mapit.mysociety.org/
[MapIt UK]: http://mapit.mysociety.org/
[OpenStreetMap]: http://www.openstreetmap.org/
[GeoDjango]: http://geodjango.org/
[PostGIS]: http://postgis.refractions.net/
