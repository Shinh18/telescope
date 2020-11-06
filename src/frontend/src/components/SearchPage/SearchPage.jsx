import React, { useState } from 'react';

import { Container } from '@material-ui/core';
import Box from '@material-ui/core/Box';

import { makeStyles } from '@material-ui/core/styles';

import useSiteMetadata from '../../hooks/use-site-metadata';

import Timeline from '../Posts/Timeline.jsx';
import SearchBar from '../SearchBar';
import Spinner from '../Spinner';

const useStyles = makeStyles(() => ({
  boxAfterHeader: {
    minHeight: '12em',
    display: 'flex',
  },
  spinner: {
    display: 'flex',
    justifyContent: 'center',
  },
  searchResults: {
    padding: 0,
    width: '785px',
    justifyContent: 'center',
  },
}));

const SearchPage = () => {
  const { telescopeUrl } = useSiteMetadata();
  const classes = useStyles();

  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState(undefined);
  const [filter, setFilter] = useState('post');
  const [fetchLoading, setFetchLoading] = useState(false);

  const search = async () => {
    const encodedSearchText = encodeURIComponent(searchText);
    try {
      setFetchLoading(true);
      const res = await fetch(`${telescopeUrl}/query?text=${encodedSearchText}&filter=${filter}`);
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      const searchResults = await res.json();
      // ES values property contains an array of objects with a (feed) id property
      const posts = searchResults.values.map((result) => ({
        id: result.id,
        url: `/posts/${result.id}`,
      }));
      setFetchLoading(false);
      setResults({ posts });
    } catch (error) {
      console.error('Something went wrong while fetching data', error);
    }
  };

  // Displays one of three options depending on whether there is a search string, results and no results
  const displayResults = () => {
    if (searchText.length > 0 && fetchLoading) {
      return (
        <h1 className={classes.spinner}>
          <Spinner />
        </h1>
      );
    }

    if (!results) {
      return null;
    }

    return <Timeline pages={[results.posts]} />;
  };

  function onChangeHandler(value) {
    setSearchText(value);
  }

  function onFilterChangeHandler(value) {
    setFilter(value);
  }

  function onFormSubmitHandler() {
    search();
  }

  return (
    <div>
      <Box className={classes.boxAfterHeader}></Box>
      <SearchBar
        searchText={searchText}
        onChangeHandler={onChangeHandler}
        filter={filter}
        onFormSubmit={onFormSubmitHandler}
        onFilterChangeHandler={onFilterChangeHandler}
      />
      <br />
      <Container className={classes.searchResults}>{displayResults()}</Container>
    </div>
  );
};

export default SearchPage;
