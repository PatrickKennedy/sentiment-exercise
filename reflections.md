## What choices did you make and why?
The most obvious choice is to use Javascript. I would have liked to use ruby,
however, as I thought about what I wanted to do, testing, modularity, etc.
I realized my time would be better spent with something I know, so between
Python and Javascript I chose Javascript for it's immediate application.

The other reason I wanted to use Javascript was to make the Chrome extension.
It's entirely self-contained (I wanted to be able to build it with grunt and
Browserify or something, but that clearly didn't happen). You can install the
extension in Chrome just by dragging it into the extensions tab with Developer
Mode enabled.

## What, if anything, was difficult?
Nailing down the structure of the project was probably the most difficult part.
I spent a lot of time fighting with Karma, then with Grunt setting up Mocha
and then if I should dive into Gulp (I decided not to for the same reason I
used Javascript).

I also went back and forth on how to break everything up. I think I struck a
nice balance between what's in a module and what's manually glued together.

## What would you improve if you had more time?
I'm actually really happy with how it turned out. I was able to easily write
a Chrome Extension. Writing a dummy client proved rather painless. After v0.1.0
I made various improvements that didn't require much mucking about.

That said, I'd really like to flesh out the clients a little more, turning the
whole thing into a more complete package that could be used in another app to
digest tweets, and not just use the sentiment Analyzer itself.

Documentation is a big thing that's missing though. I never took the time to
learn a standard style in Javascript so I've basically tried to rely on writing
descriptive code.

Data validation is also pretty inconsistent. For example, Twitter defaults to 15
tweets returned by the API if you ask for "bacon" tweets, so I completely
leave that up to Twitter in the client, but the count is validated by yargs
coming into the application.

## What design or architecture principles did you leverage?
This is definitely a weak point in my knowledge. I really have little education
of different types of architectures. My main thinking is separation of concerns:
 the sentiment analyzer shouldn't have to care about where the strings it
analyzes come from, the twitter client shouldn't have to worry about displaying
the end result, etc.

I like to include reasonable defaults but make the important logic easy to
overwrite.

## What recent book or blog post did you read that gave you the inspiration to try something new?
I use Google so much it's sometimes hard to know what ideas come from where.
For this project I already had an idea in mind about how I wanted to approach it
(I'm in love with extensibility and DRY and modularity to begin with), so most
of what I read was documentation. I did learn `(undefined == null)` is truthy
though!

## What are the upsides of your choices?
By writing in Javascript the code is easily ported to a browser environment.
From a design perspective, the separation of concerns makes the system more
extensible (socialytics-contrib-twitter, socialytics-contrib-facebook, etc).

## What are the downsides?
As it's built right now it would be hard to work in a queue if the analytics
suddenly needed to be significantly more intensive. Beyond that, a lot of the
downsides I ran into while refining the structure over the weekend so I was
able to proactively redesign those aspects (I don't remember must of them
because I figured if I went all stream of consciousness on this doc it would
be MASSIVE).

Thanks again for the opportunity, and the fun exercise!
