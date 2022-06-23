import torch
from torch import nn
from torch.utils.data import Dataset
import gluonnlp as nlp
import numpy as np
from kobert import get_tokenizer
from kobert import get_pytorch_kobert_model
import pandas as pd


class BERTDataset(Dataset):
    def __init__(self, dataset, sent_idx, label_idx, bert_tokenizer, max_len,
                 pad, pair):
        transform = nlp.data.BERTSentenceTransform(
            bert_tokenizer, max_seq_length=max_len, pad=pad, pair=pair)

        self.sentences = [transform([row[1].to_list()[sent_idx]]) for row in dataset.iterrows()]
        self.labels = [np.int32(row[1].to_list()[label_idx]) for row in dataset.iterrows()]

    def __getitem__(self, i):
        return (self.sentences[i] + (self.labels[i], ))

    def __len__(self):
        return (len(self.labels))


class BERTClassifier(nn.Module):
    def __init__(self,
                 bert,
                 hidden_size=768,
                 num_classes=5,
                 dr_rate=None,
                 params=None):
        super(BERTClassifier, self).__init__()
        self.bert = bert
        self.dr_rate = dr_rate

        self.classifier = nn.Linear(hidden_size, num_classes)
        if dr_rate:
            self.dropout = nn.Dropout(p=dr_rate)

    def gen_attention_mask(self, token_ids, valid_length):
        attention_mask = torch.zeros_like(token_ids)
        for i, v in enumerate(valid_length):
            attention_mask[i][:v] = 1
        return attention_mask.float()

    def forward(self, token_ids, valid_length, segment_ids):
        attention_mask = self.gen_attention_mask(token_ids, valid_length)

        _, pooler = self.bert(input_ids=token_ids, token_type_ids=segment_ids.long(),
                              attention_mask=attention_mask.float().to(token_ids.device))
        if self.dr_rate:
            out = self.dropout(pooler)
        else:
            out = pooler
        return self.classifier(out)


def predict_rating(review=''):
    # prepare fine-tuned koBERT model
    bert_model, vocab = get_pytorch_kobert_model(cachedir='.cache')
    model = BERTClassifier(bert_model, dr_rate=0.5)
    model.load_state_dict(torch.load('app/files/five_model.pt', map_location='cpu'))
    # prepare tokenizer
    tokenizer = get_tokenizer()
    tok = nlp.data.BERTSPTokenizer(tokenizer, vocab, lower=False)
    # prepare input data
    reviews = [[review, 0]]
    test_df = pd.DataFrame(reviews, columns=[['리뷰 내용', '별점']])
    test_set = BERTDataset(test_df, 0, 1, tok, 64, True, False)
    test_input = torch.utils.data.DataLoader(test_set, batch_size=1, num_workers=1)
    # feed model
    for batch_id, (token_ids, valid_length, segment_ids, label) in enumerate(test_input):
      token_ids = token_ids.long()
      segment_ids = segment_ids.long()
      valid_length = valid_length
      out = model(token_ids, valid_length, segment_ids)
      max_vals, max_indices = torch.max(out, 1)
      return max_indices.item() + 1


def predict_pn(reviews=[]):
    # prepare fine-tuned koBERT model
    bert_model, vocab = get_pytorch_kobert_model(cachedir='.cache')
    model = BERTClassifier(bert_model, dr_rate=0.5, num_classes=2)
    model.load_state_dict(torch.load('app/files/binary_model.pt', map_location='cpu'))
    # prepare tokenizer
    tokenizer = get_tokenizer()
    tok = nlp.data.BERTSPTokenizer(tokenizer, vocab, lower=False)
    # prepare input data
    review_list = [[review, 0] for review in reviews]
    test_df = pd.DataFrame(review_list, columns=[['리뷰 내용', '별점']])
    test_set = BERTDataset(test_df, 0, 1, tok, 64, True, False)
    test_input = torch.utils.data.DataLoader(test_set, batch_size=1, num_workers=1)
    # feed model
    result = []
    for batch_id, (token_ids, valid_length, segment_ids, label) in enumerate(test_input):
      token_ids = token_ids.long()
      segment_ids = segment_ids.long()
      valid_length = valid_length
      out = model(token_ids, valid_length, segment_ids)
      max_vals, max_indices = torch.max(out, 1)
      result.append(max_indices.item())
    return result