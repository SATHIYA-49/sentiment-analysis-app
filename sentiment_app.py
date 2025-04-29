import streamlit as st
import pandas as pd
import re
from textblob import TextBlob
import matplotlib.pyplot as plt
import seaborn as sns
from collections import Counter

# Title
st.title("📊 Sentiment Analysis for Product Improvement")

# File uploader
uploaded_file = st.file_uploader("Upload a CSV file with customer reviews", type=["csv"])

if uploaded_file:
    df = pd.read_csv(uploaded_file)

    # Show dataset
    st.subheader("Uploaded Dataset")
    st.dataframe(df.head())

    # Auto-detect product name from file name or review content
    product_name = re.sub(r'[_\-]', ' ', uploaded_file.name.replace(".csv", ""))
    st.markdown(f"### Detected Product: 🛍️ **{product_name.title()}**")

    # Check for review column
    review_col = None
    for col in df.columns:
        if 'review' in col.lower():
            review_col = col
            break

    if not review_col:
        st.error("No review column found in the dataset.")
    else:
        # Sentiment classification
        def classify_sentiment(text):
            analysis = TextBlob(str(text))
            polarity = analysis.sentiment.polarity
            if polarity > 0.1:
                return 'Positive'
            elif polarity < -0.1:
                return 'Negative'
            else:
                return 'Neutral'

        df['sentiment'] = df[review_col].apply(classify_sentiment)

        # Sentiment distribution
        st.subheader("📈 Sentiment Distribution")
        sentiment_counts = df['sentiment'].value_counts()
        st.write(sentiment_counts)

        fig, ax = plt.subplots()
        sns.countplot(data=df, x='sentiment', order=['Positive', 'Neutral', 'Negative'])
        st.pyplot(fig)

        # Key Metrics Detection from Reviews
        st.subheader("🔍 Key Metrics from Customer Reviews")
        
        # Get reviews by sentiment type
        positive_reviews = df[df['sentiment'] == 'Positive'][review_col].str.lower()
        neutral_reviews = df[df['sentiment'] == 'Neutral'][review_col].str.lower()
        negative_reviews = df[df['sentiment'] == 'Negative'][review_col].str.lower()

        # Define a list of keywords to detect common issues and features
        issue_keywords = ['battery drain', 'slow performance', 'screen flickering', 'poor build quality']
        feature_keywords = ['camera', 'battery life', 'performance', 'screen', 'design', 'ease of use']

        # Count the occurrences of each keyword
        issue_counts = Counter()
        feature_counts = Counter()

        # Detect common issues in negative reviews
        for review in negative_reviews:
            for keyword in issue_keywords:
                if keyword in review:
                    issue_counts[keyword] += 1
            for keyword in feature_keywords:
                if keyword in review:
                    feature_counts[keyword] += 1

        # Detect common features in positive reviews
        positive_feature_counts = Counter()
        for review in positive_reviews:
            for keyword in feature_keywords:
                if keyword in review:
                    positive_feature_counts[keyword] += 1

        # Display detected issues for negative reviews
        if issue_counts:
            st.write("### Common Complaints (Negative Reviews):")
            for issue, count in issue_counts.items():
                st.write(f"- {issue.capitalize()}: {count} occurrences")
        else:
            st.write("No common issues found in negative reviews.")

        # Display detected features for positive reviews
        if positive_feature_counts:
            st.write("### Common Compliments (Positive Reviews):")
            for feature, count in positive_feature_counts.items():
                st.write(f"- {feature.capitalize()}: {count} occurrences")
        else:
            st.write("No common compliments found in positive reviews.")
        
        # Automated Suggestions for Product Improvement
        st.subheader("💡 Automated Suggestions for Product Improvement")

        pos = sentiment_counts.get('Positive', 0)
        neu = sentiment_counts.get('Neutral', 0)
        neg = sentiment_counts.get('Negative', 0)
        total = pos + neu + neg

        if total == 0:
            st.warning("No reviews available to generate suggestions.")
        else:
            positive_pct = (pos / total) * 100
            negative_pct = (neg / total) * 100
            neutral_pct = (neu / total) * 100

            # Suggestions for negative reviews
            if negative_pct > 20:
                st.markdown("### 🔧 Suggestions for Improvement Based on Negative Feedback:")
                for issue, count in issue_counts.items():
                    st.write(f"- **{issue.capitalize()}** is frequently mentioned. Addressing this issue could significantly improve user satisfaction.")
                st.write(f"- **{negative_pct:.1f}%** of reviews are negative. Consider analyzing specific complaints further.")

            # Suggestions for positive reviews
            if positive_pct > 60:
                st.markdown("### ✅ Suggestions for Maintaining Positive Feedback:")
                for feature, count in positive_feature_counts.items():
                    st.write(f"- **{feature.capitalize()}** is frequently praised. Continue enhancing and maintaining this feature.")
                st.write(f"- **{positive_pct:.1f}%** of reviews are positive. Great job maintaining quality!")
            
            # Suggestions for neutral reviews
            if neutral_pct > 10:
                st.markdown("### 🤔 Suggestions for Neutral Feedback:")
                st.write(f"- **{neutral_pct:.1f}%** of reviews are neutral. There is room for improvement. Focus on addressing specific areas that are neither too good nor too bad.")
                st.write("- Look into features that received mixed feedback, and try to enhance them to increase customer satisfaction.")

        st.success("✔️ Analysis Complete")
