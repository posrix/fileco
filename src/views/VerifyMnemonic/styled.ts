import styled, { css } from 'styled-components';

export const Container = styled.div`
  padding: 20px;
`;

const BaseWordMixin = css`
  width: 88px;
  height: 30px;
  padding: 4px;
  border-radius: 3px;
  font-size: 16px;
  font-weight: bolder;
  cursor: pointer;
  display: flex;

  align-items: center;
`;

export const WordButton = styled.div`
  ${BaseWordMixin}
  justify-content: center;
  color: #5cc1cb;
  border: 1px solid #5cc1cb;
  background-color: #fff;
`;

export const SortedWordButton = styled.div`
  ${BaseWordMixin}
  justify-content: space-around;
  color: #000;
  border: 1px solid #c5c5c5;
  background-color: #fff;
`;

export const WordsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const SortedWordsContainer = styled.div<{ hasWords: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: ${(props) => (props.hasWords ? '20px 0' : '8px 0')};
`;
