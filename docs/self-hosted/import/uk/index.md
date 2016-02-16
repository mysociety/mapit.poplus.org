---
layout: inner-page
title: Importing UK boundary data
---

Here are the basic instructions to install UK data from OS OpenData, ONSPD, and OSNI Open Data:

1. AREA_SRID in conf/general.yml should be 27700 (as Boundary-Line shapes are
   in the OSGB projection).

2. Change to the project directory, and create database tables (if you haven't
   already done this):

        ./manage.py migrate

   Note if you had already done this but only then changed the AREA_SRID, you
   will need to `./manage.py migrate mapit zero` and then `./manage.py migrate
   mapit` again to get the right SRID in the database.

For notes on what was done to create generations as you can see on
<http://mapit.mysociety.org/>, see the end of this file.

For data released after Nov 2015
--------------------------------

We use ONSPD to import all uk postcodes, Boundary-Line to import GB shapes, and OSNI to import NI shapes.  Code Point is not used.

1. Download the latest Boundary-Line, ONSPD, and OSNI data from
   <http://parlvid.mysociety.org/os/>, and save/unzip in the data directory.  You need to unzip the OSNI data twice as it contains zipped folders.

2. Run the following in order:

{% highlight bash %}
./manage.py mapit_generation_create --commit --desc "Initial import."
./manage.py loaddata uk
./manage.py mapit_UK_import_boundary_line \
    --control=mapit_gb.controls.first-gss --commit \
    `ls ../data/Boundary-Line/Data/GB/**/*.shp | \
    grep -v high_water | \
    grep -Ev Supplementary_\[Historical\|Ceremonial\]`
./manage.py mapit_UK_import_osni --control=mapit_gb.controls.first-gss \
    --wmc=../data/OSNI/OSNI_Open_Data_Largescale_Boundaries__Parliamentary_Constituencies_2008/OSNI_Open_Data_Largescale_Boundaries__Parliamentary_Constituencies_2008.shp \
    --wmc-srid=4326 \
    --lgd=../data/OSNI/OSNI_Open_Data_Largescale_Boundaries__Local_Government_Districts_2012/OSNI_Open_Data_Largescale_Boundaries__Local_Government_Districts_2012.shp \
    --lgd-srid=4326 \
    --lge=../data/OSNI/OSNI_Open_Data_Largescale_Boundaries__District_Electoral_Areas_2012/OSNI_Open_Data_Largescale_Boundaries__District_Electoral_Areas_2012.shp \
    --lge-srid=29902 \
    --lgw=../data/OSNI/OSNI_Open_Data_Largescale_Boundaries_Wards_2012/OSNI_Open_Data_Largescale_Boundaries_Wards_2012.shp \
    --lgw-srid=4326 \
    --eur=../data/OSNI/OSNI_Open_Data_Largescale_Boundaries__NI_Outline/OSNI_Open_Data_Largescale_Boundaries__NI_Outline.shp \
    --eur-srid=29902 \
    --commit
./manage.py mapit_UK_add_names_to_ni_areas
./manage.py mapit_UK_find_parents --commit
./manage.py mapit_UK_import_onspd do --crown-dependencies=include --northern-ireland=include ../data/ONSPD/Data/ONSPD_AUG_2015_UK.csv
./manage.py mapit_UK_scilly --allow-no-location-postcodes \
    --allow-terminated-postcodes ../data/ONSPD/Data/ONSPD_AUG_2015_UK.csv
./manage.py loaddata uk_special_postcodes
./manage.py mapit_UK_add_ons_to_gss
./manage.py mapit_generation_activate --commit

{% endhighlight %}

Notes:

* All commands with a `--commit` argument can be run without that argument to
  do a dry run and see what would be imported
* Pay attention to the filenames used in the `mapit_UK_import_boundary_line`,
  `mapit_UK_import_osni`, `mapit_UK_import_onspd`, and `mapit_UK_scilly`
  commands.  These are likely to change with newer releases so you'll have to
  change the command to refer to the correct filenames.
* Pay attention to the `--*-srid` options on the `mapit_UK_import_osni` command.
  This refers to the projection that the data was released in and it may change
  with new releases.  If the releases came from the mysociety cache you should find a `metadata.json` file in the OSNI folder that contains the SRID for
  each file.  If you obtained new releases yourself you can load the shapefiles
  in a tool such as [qgis](http://www.qgis.org/) to find the SRID yourself.
* Many of these commands take options that you may wish to investigate to
  customise the data imported to your database.

For data released before Nov 2015
---------------------------------

We use Code-Point Open to import GB postcodes, ONSPD to import NI and crown dependency postcodes, and Boundary-Line to import GB shapes.  There is no NI shape data.

1. Download the latest Code-Point Open, Boundary-Line and ONSPD from
   <http://parlvid.mysociety.org/os/>, and save/unzip in the data directory.

2. Run the following in order:

{% highlight bash %}
./manage.py mapit_generation_create --commit --desc "Initial import."
./manage.py loaddata uk
./manage.py mapit_UK_import_boundary_line \
    --control=mapit_gb.controls.first-gss --commit \
    `\ls ../data/Boundary-Line/Data/*.shp|\grep -v high_water`
# (You can run without --commit to do a dry run.)
# first-gss in the above assumes the Boundary Line you're importing
# is October 2010 or later, and uses the new GSS codes.
./manage.py mapit_UK_find_parents --commit
./manage.py mapit_UK_import_codepoint ../data/Code-Point-Open/*.csv
./manage.py mapit_UK_scilly ../data/Code-Point-Open/tr.csv
./manage.py mapit_UK_import_nspd_ni_areas
./manage.py mapit_UK_import_nspd_ni ../data/ONSPD.csv
./manage.py mapit_UK_import_nspd_crown_dependencies ../data/ONSPD.csv
./manage.py mapit_generation_activate --commit
{% endhighlight %}

Notes on future releases
------------------------

What to run when new data is released:

* ONSPD: `mapit_UK_import_onspd`
* OSNI: Create a control file, `mapit_UK_import_osni` and `mapit_UK_find_parents`.
* Boundary-Line: Create a control file, `mapit_UK_import_boundary_line` and
  `mapit_UK_find_parents`.

You can manually increase the `generation_high_id` when something is new and
something else isn't.  For example a new Boundary-Line means a new generation
for Great Britain, and you can then increase the Northern Ireland boundaries
manually to be in the new generation and vice-versa for a new OSNI.

Notes on creating what's live
-----------------------------

When creating what you see at mapit.mysociety.org, to enable it to have
pre-2010 election boundaries, I ran the above (or rather, what existed at the
time, which is not identical) twice, once with 2009-10 Boundary-Line and then
the 2010-05 edition. I had to write the 2010-05 control file you can see, did
not re-run `mapit_UK_import_codepoint` (as no postcodes had changed), and only
ran the NI stuff the second generation (as we only had current data). The
commands I basically ran are below.

Even worse, as I had to maintain IDs between our old and new versions of mapit,
I then matched up all IDs and names using the scripts in bin, manually inserted
some generation 10 areas (in data) for FixMyStreet and some generation 12 NI
WMC areas for WriteToThem, and manually added our test/fake areas that used to
be in code but can now happily sit in the database along with everything else.
You probably don't need any of that for your own install.

{% highlight bash %}
# Create inactive generation.
./manage.py mapit_UK_import_boundary_line \
    --control=mapit_gb.controls.2009-10 \
    `\ls ../../data/Boundary-Line/2009-10/*.shp|\grep -v high_water`
./manage.py mapit_UK_import_codepoint \
    ../../data/Code-Point-Open-2010-05/*.csv
./manage.py mapit_UK_find_parents
# Not importing NI here, as that only has the current boundaries.
./manage.py mapit_UK_scilly ../../data/Code-Point-Open-2010-05/tr.csv
# Make generation active, add another inactive generation
./manage.py mapit_UK_import_boundary_line \
    --control=mapit_gb.controls.2010-05 \
    `\ls ../../data/Boundary-Line/2010-05/*.shp|\grep -v high_water`
# mapit_UK_import_codepoint not needed as it's the same
# and there's no P-in-P tests!
./manage.py mapit_UK_find_parents
# I doubt the boundaries change! But updates the generation.
./manage.py mapit_UK_scilly ../../data/Code-Point-Open-2010-05/tr.csv
# This is now split into two scripts, see above.
./manage.py mapit_UK_import_nspd ../../data/NSPD-2010-05.csv
# Make generation active.
{% endhighlight %}

