This readme describes the structure of data as markdown files here.

There are two subdirs for now: inputs and scenarios.

These subdirs also have subdirs, but they are just for human convenience -- the actual
category data is stored in markdown frontmatter (as `variable_type` for scenarios and `category` for scenarios). Right now these are redundant, but in the future as the library grows in size this might change. So, it is important to list the variable type and category in the markdown directly.